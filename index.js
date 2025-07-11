const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const fs = require("fs")
const path = require("path")

// Generate unique session ID with trend-x~ prefix
const generateSessionId = () => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  return `trend-x~${timestamp}_${randomString}`
}

// Initialize WhatsApp client with custom session
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: generateSessionId(),
    dataPath: "./sessions",
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
})

// Bot configuration
const BOT_CONFIG = {
  prefix: "!",
  adminNumbers: [], // Add admin phone numbers here (format: 1234567890@c.us)
  welcomeMessage: "Welcome to Trend-X Bot! 🤖\n\nType !help to see available commands.",
  helpMessage: `
🤖 *Trend-X Bot Commands*

*General Commands:*
!help - Show this help message
!ping - Check bot status
!info - Bot information

*Admin Commands:*
!broadcast <message> - Send message to all groups
!stats - Get bot statistics

*Fun Commands:*
!joke - Get a random joke
!quote - Get an inspirational quote

Powered by Trend-X 🚀
    `,
}

// Store for bot statistics
const botStats = {
  messagesReceived: 0,
  commandsExecuted: 0,
  startTime: new Date(),
}

// Event: QR Code generation
client.on("qr", (qr) => {
  console.log("🔗 Scan the QR code below to connect your WhatsApp:")
  qrcode.generate(qr, { small: true })
  console.log("📱 Open WhatsApp > Linked Devices > Link a Device")
})

// Event: Client ready
client.on("ready", () => {
  console.log("✅ Trend-X WhatsApp Bot is ready!")
  console.log(`📱 Session ID: ${client.authStrategy.clientId}`)
  console.log("🤖 Bot is now listening for messages...")
})

// Event: Authentication success
client.on("authenticated", () => {
  console.log("🔐 Authentication successful!")
})

// Event: Authentication failure
client.on("auth_failure", (msg) => {
  console.error("❌ Authentication failed:", msg)
})

// Event: Client disconnected
client.on("disconnected", (reason) => {
  console.log("📴 Client was logged out:", reason)
})

// Event: Message received
client.on("message_create", async (message) => {
  // Skip if message is from status broadcast
  if (message.from === "status@broadcast") return

  // Skip if message is from self (to avoid loops)
  if (message.fromMe) return

  botStats.messagesReceived++

  const chat = await message.getChat()
  const contact = await message.getContact()
  const messageBody = message.body.trim()

  // Log incoming message
  console.log(`📨 Message from ${contact.name || contact.number}: ${messageBody}`)

  // Check if message starts with command prefix
  if (messageBody.startsWith(BOT_CONFIG.prefix)) {
    await handleCommand(message, chat, contact)
  } else {
    // Handle non-command messages
    await handleRegularMessage(message, chat, contact)
  }
})

// Handle bot commands
async function handleCommand(message, chat, contact) {
  const args = message.body.slice(BOT_CONFIG.prefix.length).trim().split(" ")
  const command = args[0].toLowerCase()

  botStats.commandsExecuted++

  try {
    switch (command) {
      case "help":
        await message.reply(BOT_CONFIG.helpMessage)
        break

      case "ping":
        const startTime = Date.now()
        const reply = await message.reply("🏓 Pong!")
        const endTime = Date.now()
        await client.sendMessage(message.from, `⚡ Response time: ${endTime - startTime}ms`)
        break

      case "info":
        const uptime = Math.floor((Date.now() - botStats.startTime.getTime()) / 1000)
        const info = `
🤖 *Trend-X Bot Information*

📊 *Statistics:*
• Messages Received: ${botStats.messagesReceived}
• Commands Executed: ${botStats.commandsExecuted}
• Uptime: ${formatUptime(uptime)}

🔧 *Session:*
• Session ID: ${client.authStrategy.clientId}
• Status: Active ✅

💡 *Version:* 1.0.0
                `
        await message.reply(info)
        break

      case "joke":
        const jokes = [
          "Why don't scientists trust atoms? Because they make up everything! 😄",
          "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
          "Why don't eggs tell jokes? They'd crack each other up! 🥚",
          "What do you call a fake noodle? An impasta! 🍝",
          "Why did the math book look so sad? Because it had too many problems! 📚",
        ]
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
        await message.reply(randomJoke)
        break

      case "quote":
        const quotes = [
          "The only way to do great work is to love what you do. - Steve Jobs 💪",
          "Innovation distinguishes between a leader and a follower. - Steve Jobs 🚀",
          "Life is what happens to you while you're busy making other plans. - John Lennon 🌟",
          "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt ✨",
          "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill 🎯",
        ]
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        await message.reply(randomQuote)
        break

      case "broadcast":
        if (!isAdmin(contact.number)) {
          await message.reply("❌ This command is only available for administrators.")
          return
        }

        const broadcastMessage = args.slice(1).join(" ")
        if (!broadcastMessage) {
          await message.reply("❌ Please provide a message to broadcast.\nUsage: !broadcast <message>")
          return
        }

        await broadcastToGroups(broadcastMessage)
        await message.reply("✅ Broadcast message sent to all groups!")
        break

      case "stats":
        if (!isAdmin(contact.number)) {
          await message.reply("❌ This command is only available for administrators.")
          return
        }

        const statsUptime = Math.floor((Date.now() - botStats.startTime.getTime()) / 1000)
        const statsMessage = `
📊 *Trend-X Bot Statistics*

📈 *Usage:*
• Messages Received: ${botStats.messagesReceived}
• Commands Executed: ${botStats.commandsExecuted}
• Uptime: ${formatUptime(statsUptime)}

⏰ *Started:* ${botStats.startTime.toLocaleString()}
🔧 *Session:* ${client.authStrategy.clientId}
                `
        await message.reply(statsMessage)
        break

      default:
        await message.reply(
          `❓ Unknown command: ${command}\n\nType ${BOT_CONFIG.prefix}help to see available commands.`,
        )
    }
  } catch (error) {
    console.error("❌ Error handling command:", error)
    await message.reply("❌ An error occurred while processing your command. Please try again later.")
  }
}

// Handle regular (non-command) messages
async function handleRegularMessage(message, chat, contact) {
  // Welcome new group members
  if (message.type === "notification_template" && message.body.includes("joined")) {
    if (chat.isGroup) {
      await chat.sendMessage(BOT_CONFIG.welcomeMessage)
    }
  }

  // Auto-respond to specific keywords
  const messageBody = message.body.toLowerCase()

  if (messageBody.includes("hello") || messageBody.includes("hi") || messageBody.includes("hey")) {
    await message.reply(`Hello ${contact.name || "there"}! 👋\n\n${BOT_CONFIG.welcomeMessage}`)
  }
}

// Check if user is admin
function isAdmin(phoneNumber) {
  return BOT_CONFIG.adminNumbers.includes(`${phoneNumber}@c.us`)
}

// Broadcast message to all groups
async function broadcastToGroups(message) {
  const chats = await client.getChats()
  const groups = chats.filter((chat) => chat.isGroup)

  for (const group of groups) {
    try {
      await group.sendMessage(`📢 *Broadcast Message*\n\n${message}`)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Delay to avoid spam
    } catch (error) {
      console.error(`❌ Failed to send broadcast to ${group.name}:`, error)
    }
  }
}

// Format uptime in human readable format
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  let uptime = ""
  if (days > 0) uptime += `${days}d `
  if (hours > 0) uptime += `${hours}h `
  if (minutes > 0) uptime += `${minutes}m `
  uptime += `${secs}s`

  return uptime
}

// Error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason)
})

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error)
  process.exit(1)
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down Trend-X Bot...")
  await client.destroy()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down Trend-X Bot...")
  await client.destroy()
  process.exit(0)
})

// Initialize the client
console.log("🚀 Starting Trend-X WhatsApp Bot...")
client.initialize()

// Export client for external use
module.exports = client
