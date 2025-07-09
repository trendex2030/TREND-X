const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const P = require('pino');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');

const { SESSION_ID } = require('./config');

// Auto-load session from Mega link
const { File } = require('megajs');
if (!fs.existsSync('./sessions/creds.json')) {
  if (!SESSION_ID) {
    console.error("❌ SESSION_ID missing in config.env");
    process.exit(1);
  }

  const sessionCode = SESSION_ID.replace("trend-x~;;;", '');
  const file = File.fromURL(`https://mega.nz/file/${sessionCode}`);
  file.download((err, data) => {
    if (err) throw err;
    fs.writeFileSync('./sessions/creds.json', data);
    console.log("✅ Session file downloaded.");
  });
}

// === Start Bot ===
async function startBot() {
  console.log("⚡ Connecting to WhatsApp...");

  const { state, saveCreds } = await useMultiFileAuthState('./sessions');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: true,
    browser: Browsers.macOS("Safari"),
    logger: P({ level: 'silent' })
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      console.log('✅ WhatsApp connected!');
    } else if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('⚠️ Connection closed. Reconnecting...', shouldReconnect);
      if (shouldReconnect) startBot();
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async (msg) => {
    const m = msg.messages[0];
    if (!m.message) return;

    const sender = m.key.remoteJid;
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text;

    if (text?.toLowerCase() === 'ping') {
      await sock.sendMessage(sender, { text: 'Pong! 🏓' }, { quoted: m });
    }
  });
}

startBot();
