// index.js — TREND-X WhatsApp bot entry point using Baileys

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  proto,
  getContentType,
  generateWAMessageFromContent,
  generateForwardMessageContent,
  downloadContentFromMessage,
  Browsers,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const P = require('pino');
const fs = require('fs');
const express = require('express');
const axios = require('axios');
const path = require('path');
const FileType = require('file-type');
const { getBuffer } = require('./lib/functions');

// ✅ Express server to keep Render Web Service alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('🤖 TREND-X is running!'));
app.listen(PORT, () => console.log(`🌐 Ping server running on http://localhost:${PORT}`));

async function connectToWA() {
  console.log("Connecting to WhatsApp ⏳️...");

  // ✅ Ensure session folder exists to avoid crash
  const authFolder = path.join(__dirname, 'sessions', 'trend-x~');
  fs.mkdirSync(authFolder, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: Browsers.macOS('Firefox'),
    syncFullHistory: true,
    auth: state,
    version
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("🔁 Reconnecting in 2 seconds...");
        await new Promise(res => setTimeout(res, 2000));
        connectToWA();
      } else {
        console.log("❌ Logged out — please scan again");
      }
    } else if (connection === 'open') {
      console.log("✅ TREND-X bot connected to WhatsApp");

      try {
        await sock.newsletterFollow("120363290715861418@newsletter");
        console.log("📬 Followed POPKID newsletter");
      } catch (e) {
        console.error("Newsletter follow failed", e);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // ✅ Incoming message handler
  sock.ev.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.message) return;

      const type = getContentType(msg.message);
      const from = msg.key.remoteJid;
      console.log(`📨 Message type: ${type} from ${from}`);

      // 👉 Your command handler logic goes here

    } catch (err) {
      console.error("❌ Error in message handler:", err);
    }
  });

  // ✅ Utility to send files from URL
  sock.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    try {
      const res = await axios.head(url);
      const mime = res.headers['content-type'];

      if (mime.split("/")[1] === "gif") {
        return sock.sendMessage(jid, {
          video: await getBuffer(url),
          caption,
          gifPlayback: true,
          ...options
        }, { quoted });
      }

      if (mime === "application/pdf") {
        return sock.sendMessage(jid, {
          document: await getBuffer(url),
          mimetype: 'application/pdf',
          caption,
          ...options
        }, { quoted });
      }

      if (mime.split("/")[0] === "image") {
        return sock.sendMessage(jid, {
          image: await getBuffer(url),
          caption,
          ...options
        }, { quoted });
      }

      if (mime.split("/")[0] === "video") {
        return sock.sendMessage(jid, {
          video: await getBuffer(url),
          caption,
          ...options
        }, { quoted });
      }
    } catch (err) {
      console.error("Error sending file from URL:", err);
    }
  };
}

// 🔁 Start WhatsApp bot connection
connectToWA();
