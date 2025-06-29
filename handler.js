import { getContentType } from "@whiskeysockets/baileys"
import { plugins } from "./lib/plugins.js"
import { DATABASE } from "./lib/database.js"

export async function handler(chatUpdate) {
  try {
    const { messages } = chatUpdate
    if (!messages || !messages[0]) return

    const m = messages[0]
    if (m.key && m.key.remoteJid === "status@broadcast") return
    if (!m.message) return

    // Parse message
    const msg = await parseMessage(m)
    if (!msg.text) return

    // Check if message starts with prefix
    const prefixRegex = new RegExp(`^[${global.prefix}]`)
    if (!prefixRegex.test(msg.text)) return

    // Extract command and arguments
    const [command, ...args] = msg.text.slice(1).trim().split(" ")
    msg.command = command.toLowerCase()
    msg.args = args
    msg.text = args.join(" ")

    // Check if user is banned
    if (DATABASE.isBanned(msg.sender) && !msg.isOwner) return

    // Find and execute plugin
    const plugin = plugins.find((p) => p.command.includes(msg.command) || p.alias?.includes(msg.command))

    if (plugin) {
      // Check permissions
      if (plugin.owner && !msg.isOwner) {
        return msg.reply("❌ This command is only for bot owner!")
      }

      if (plugin.admin && !msg.isAdmin && !msg.isOwner) {
        return msg.reply("❌ This command is only for group admins!")
      }

      if (plugin.group && !msg.isGroup) {
        return msg.reply("❌ This command can only be used in groups!")
      }

      if (plugin.private && msg.isGroup) {
        return msg.reply("❌ This command can only be used in private chat!")
      }

      // Execute plugin
      await plugin.execute(msg)
    }
  } catch (error) {
    console.error("Handler Error:", error)
  }
}

async function parseMessage(m) {
  const msg = {
    key: m.key,
    id: m.key.id,
    chat: m.key.remoteJid,
    fromMe: m.key.fromMe,
    isGroup: m.key.remoteJid.endsWith("@g.us"),
    sender: m.key.fromMe ? global.sock.user.id : m.key.participant || m.key.remoteJid,
    timestamp: m.messageTimestamp,
    message: m.message,
  }

  // Get message content
  const type = getContentType(m.message)
  const content = m.message[type]

  msg.type = type
  msg.text = content?.text || content?.caption || content || ""

  // Check permissions
  msg.isOwner = global.sudo.includes(msg.sender.split("@")[0])

  if (msg.isGroup) {
    const groupMetadata = await global.sock.groupMetadata(msg.chat)
    msg.groupMetadata = groupMetadata
    msg.isAdmin =
      groupMetadata.participants.find(
        (p) => p.id === msg.sender && (p.admin === "admin" || p.admin === "superadmin"),
      ) || msg.isOwner
    msg.isBotAdmin = groupMetadata.participants.find(
      (p) => p.id === global.sock.user.id && (p.admin === "admin" || p.admin === "superadmin"),
    )
  }

  // Add reply function
  msg.reply = async (text, options = {}) => {
    return await global.sock.sendMessage(msg.chat, { text }, { quoted: m, ...options })
  }

  // Add react function
  msg.react = async (emoji) => {
    return await global.sock.sendMessage(msg.chat, {
      react: { text: emoji, key: m.key },
    })
  }

  return msg
    }
