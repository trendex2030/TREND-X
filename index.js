import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import pino from "pino"
import qrcode from "qrcode-terminal"
import { handler } from "./handler.js"
import { loadPlugins } from "./lib/plugins.js"
import { DATABASE } from "./lib/database.js"

const logger = pino({ level: "silent" })

// Bot Configuration
global.botname = "TREND-X"
global.author = "Trendex"
global.packname = "TREND-X"
global.sudo = ["254763211803"] // Your sudo number
global.prefix = "."
global.sessionName = "TREND-X-session"

async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion()

  console.log(`Using WA v${version.join(".")}, isLatest: ${isLatest}`)

  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: true,
    auth: state,
    browser: ["TREND-X", "Chrome", "1.0.0"],
    generateHighQualityLinkPreview: true,
  })

  // Store socket globally
  global.sock = sock

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log("Scan QR Code:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("Connection closed due to", lastDisconnect?.error, ", reconnecting:", shouldReconnect)

      if (shouldReconnect) {
        startBot()
      }
    } else if (connection === "open") {
      console.log("✅ TREND-X Connected Successfully!")
      console.log("🤖 Bot is ready to use")
      console.log("👨‍💻 Author: Trendex")
    }
  })

  sock.ev.on("creds.update", saveCreds)
  sock.ev.on("messages.upsert", handler)

  return sock
}

// Load plugins
loadPlugins()

// Initialize database
DATABASE.init()

// Start the bot
startBot().catch(console.error)

// Handle process termination
process.on("uncaughtException", console.error)
process.on("unhandledRejection", console.error)
