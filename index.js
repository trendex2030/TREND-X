/**
 * Copyright (C) 2025 trendex
 *
 * This code is licensed under the GPL-3.0 LICENSE
 * See the LICENSE file in the repository root for full license text.
 *
 * TREND-X WhatsApp Bot
 * Version: 1.0.0
 * Created by Trendex King 
 * GitHub: https://github.com/trendex2030/TREND-X 
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys")

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require("./lib/functions")
const fs = require("fs")
const ff = require("fluent-ffmpeg")
const P = require("pino")
const config = require("./config")
const rankCommand = require("./plugins/rank")
const qrcode = require("qrcode-terminal")
const StickersTypes = require("wa-sticker-formatter")
const util = require("util")
const { sms, downloadMediaMessage } = require("./lib/msg")
const axios = require("axios")
const { File } = require("megajs")
const { fromBuffer } = require("file-type")
const bodyparser = require("body-parser")
const { tmpdir } = require("os")
const Crypto = require("crypto")
const path = require("path")
const prefix = config.PREFIX

const ownerNumber = ["2250104610403"]

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + "/sessions/creds.json")) {
  if (!config.SESSION_ID) {
    console.log("Please add your session to SESSION_ID env !!")
    return
  }
  const sessdata = config.SESSION_ID.replace("Wa-his-v1~", "")

  // Validate that sessdata contains a hash (format: fileId#hash)
  if (!sessdata.includes("#")) {
    console.log("⚠️ Warning: SESSION_ID may not have proper format. Expected: Wa-his-v1~fileId#hash")
    console.log("Attempting to proceed anyway...")
  }

  try {
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
    filer.download((err, data) => {
      if (err) {
        console.log("❌ Failed to download session file:", err.message)
        return
      }
      fs.writeFile(__dirname + "/sessions/creds.json", data, () => {
        console.log("SESSION DOWNLOADED COMPLETED ✅")
      })
    })
  } catch (error) {
    console.log("❌ Error creating mega.nz file URL:", error.message)
    console.log("Please check your SESSION_ID format. It should be: Wa-his-v1~fileId#hash")
  }
}

const express = require("express")
const app = express()
const port = process.env.PORT || 9090

async function connectToWA() {
  console.log("CONNECTING TREND-X 🧬...")
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + "/sessions/")
  var { version } = await fetchLatestBaileysVersion()

  const conn = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version,
  })

  conn.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        connectToWA()
      }
    } else if (connection === "open") {
      console.log("♻️ INSTALLING PLUGINS FILES PLEASE WAIT... 🪄")
      const path = require("path")
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin)
        }
      })
      console.log("PLUGINS FILES INSTALL SUCCESSFULLY ✅")
      console.log("『TREND-X 』 CONNECTED TO WHATSAPP ENJOY ✅")

      const up = `*╭═══════༺🎭 TREND-X-𝘽𝙊𝙏 ༻═══════╮*

💫 *『 TREND-X connecté avec succès ! 』*
📖 Tape *${prefix}menu* pour révéler les secrets du bot…

🃏 *Créateur :* _@hhhisoka_  
🎪 *Style :* Chaotique, Magique et Dévastateur...

📡 *Rejoins le Cirque des Ombres :*
➤ https://whatsapp.com/channel/0029Vb5u3VX0lwgllCdVTF0G

❤️‍🔥 *Ton bot est vivant… amuse-toi, mais n'oublie jamais :*
_"Le vrai plaisir est dans l'imprévu..."_ 🩸

*🧩 Préfixe mystique :* *${prefix}*

*╰═══════༺🕸️ 𝙇𝙚 𝙟𝙚𝙪 𝙘𝙤𝙢𝙢𝙚𝙣𝙘𝙚... ༻═══════╯*`
      conn.sendMessage(conn.user.id, {
        image: { url: config.MENU_IMG },
        caption: up,
      })
    }
  })
  conn.ev.on("creds.update", saveCreds)

  //=============readstatus=======

  conn.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0]
    if (!mek.message) return
    mek.message =
      getContentType(mek.message) === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message
    if (mek.key && mek.key.remoteJid === "status@broadcast" && config.AUTO_READ_STATUS === "true") {
      await conn.readMessages([mek.key])
    }
    const m = sms(conn, mek)
    const type = getContentType(mek.message)
    const content = JSON.stringify(mek.message)
    const from = mek.key.remoteJid
    const quoted =
      type == "extendedTextMessage" && mek.message.extendedTextMessage.contextInfo != null
        ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
        : []
    const body =
      type === "conversation"
        ? mek.message.conversation
        : type === "extendedTextMessage"
          ? mek.message.extendedTextMessage.text
          : type == "imageMessage" && mek.message.imageMessage.caption
            ? mek.message.imageMessage.caption
            : type == "videoMessage" && mek.message.videoMessage.caption
              ? mek.message.videoMessage.caption
              : ""
    const isCmd = body.startsWith(prefix)
    const command = isCmd ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase() : ""
    const args = body.trim().split(/ +/).slice(1)
    const q = args.join(" ")
    const isGroup = from.endsWith("@g.us")
    const isChannel = from.endsWith("@newsletter") // ✅ Détection des chaînes
    const sender = mek.key.fromMe
      ? conn.user.id.split(":")[0] + "@s.whatsapp.net" || conn.user.id
      : mek.key.participant || mek.key.remoteJid
    const senderNumber = sender.split("@")[0]
    const botNumber = conn.user.id.split(":")[0]
    const pushname = mek.pushName || "Sin Nombre"
    const isMe = botNumber.includes(senderNumber)
    const isOwner = ownerNumber.includes(senderNumber) || isMe
    const botNumber2 = await jidNormalizedUser(conn.user.id)
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch((e) => {}) : ""
    const groupName = isGroup ? groupMetadata.subject : ""
    const participants = isGroup ? await groupMetadata.participants : ""
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : ""
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false
    const isReact = m.message.reactionMessage ? true : false
    const reply = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: mek })
    }

    conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = ""
      const res = await axios.head(url)
      mime = res.headers["content-type"]
      if (mime.split("/")[1] === "gif") {
        return conn.sendMessage(
          jid,
          { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options },
          { quoted: quoted, ...options },
        )
      }
      const type = mime.split("/")[0] + "Message"
      if (mime === "application/pdf") {
        return conn.sendMessage(
          jid,
          { document: await getBuffer(url), mimetype: "application/pdf", caption: caption, ...options },
          { quoted: quoted, ...options },
        )
      }
      if (mime.split("/")[0] === "image") {
        return conn.sendMessage(
          jid,
          { image: await getBuffer(url), caption: caption, ...options },
          { quoted: quoted, ...options },
        )
      }
      if (mime.split("/")[0] === "video") {
        return conn.sendMessage(
          jid,
          { video: await getBuffer(url), caption: caption, mimetype: "video/mp4", ...options },
          { quoted: quoted, ...options },
        )
      }
      if (mime.split("/")[0] === "audio") {
        return conn.sendMessage(
          jid,
          { audio: await getBuffer(url), caption: caption, mimetype: "audio/mpeg", ...options },
          { quoted: quoted, ...options },
        )
      }
    }

    //================ownerreact==============
    if (senderNumber.includes("2250101676111")) {
      if (isReact) return
      m.react("👑")
    }
    if (senderNumber.includes("263777777777")) {
      if (isReact) return
      m.react("👑")
    }
    if (senderNumber.includes("2250104610403")) {
      if (isReact) return
      m.react("🦋")
    }

    if (senderNumber.includes("2250101676111")) {
      if (isReact) return
      m.react("🎀")
    }

    //==========================public react===============//
    // Auto React
    if (!isReact && senderNumber !== botNumber) {
      if (config.AUTO_REACT === "true") {
        const reactions = [
          "😊",
          "👍",
          "😂",
          "💯",
          "🔥",
          "🙏",
          "🎉",
          "👏",
          "😎",
          "🤖",
          "👫",
          "👭",
          "👬",
          "👮",
          "🕴️",
          "💼",
          "📊",
          "📈",
          "📉",
          "📊",
          "📝",
          "📚",
          "📰",
          "📱",
          "💻",
          "📻",
          "📺",
          "🎬",
          "📽️",
          "📸",
          "📷",
          "🕯️",
          "💡",
          "🔦",
          "🔧",
          "🔨",
          "🔩",
          "🔪",
          "🔫",
          "👑",
          "👸",
          "🤴",
          "👹",
          "🤺",
          "🤻",
          "👺",
          "🤼",
          "🤽",
          "🤾",
          "🤿",
          "🦁",
          "🐴",
          "🦊",
          "🐺",
          "🐼",
          "🐾",
          "🐿",
          "🦄",
          "🦅",
          "🦆",
          "🦇",
          "🦈",
          "🐳",
          "🐋",
          "🐟",
          "🐠",
          "🐡",
          "🐙",
          "🐚",
          "🐜",
          "🐝",
          "🐞",
          "🕷️",
          "🦋",
          "🐛",
          "🐌",
          "🐚",
          "🌿",
          "🌸",
          "💐",
          "🌹",
          "🌺",
          "🌻",
          "🌴",
          "🏵",
          "🏰",
          "🏠",
          "🏡",
          "🏢",
          "🏣",
          "🏥",
          "🏦",
          "🏧",
          "🏨",
          "🏩",
          "🏪",
          "🏫",
          "🏬",
          "🏭",
          "🏮",
          "🏯",
          "🚣",
          "🛥",
          "🚂",
          "🚁",
          "🚀",
          "🛸",
          "🛹",
          "🚴",
          "🚲",
          "🛺",
          "🚮",
          "🚯",
          "🚱",
          "🚫",
          "🚽",
          "🕳️",
          "💣",
          "🔫",
          "🕷️",
          "🕸️",
          "💀",
          "👻",
          "🕺",
          "💃",
          "🕴️",
          "👶",
          "👵",
          "👴",
          "👱",
          "👨",
          "👩",
          "👧",
          "👦",
          "👪",
        ]

        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)] //
        m.react(randomReaction)
      }
    }

    // Owner React
    if (!isReact && senderNumber === botNumber) {
      if (config.OWNER_REACT === "true") {
        const reactions = ["😊", "👍", "😂", "💯", "🔥", "🙏", "🎉", "👏", "😎", "🤖"]
        const randomOwnerReaction = reactions[Math.floor(Math.random() * reactions.length)] //
        m.react(randomOwnerReaction)
      }
    }

    //============================HRTPACK============================
    //=======HRT React
    if (!isReact && senderNumber !== botNumber) {
      if (config.HEART_REACT === "true") {
        const reactions = [
          "💘",
          "💝",
          "💖",
          "💗",
          "💓",
          "💞",
          "💕",
          "❣️",
          "❤️‍🔥",
          "❤️‍🩹",
          "❤️",
          "🩷",
          "🧡",
          "💛",
          "💚",
          "💙",
          "🩵",
          "💜",
          "🤎",
          "🖤",
          "🩶",
          "🤍",
        ]
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)] //
        m.react(randomReaction)
      }
    }

    //=======HRT React
    if (!isReact && senderNumber === botNumber) {
      if (config.HEART_REACT === "true") {
        const reactions = [
          "💘",
          "💝",
          "💖",
          "💗",
          "💓",
          "💞",
          "💕",
          "❣️",
          "❤️‍🔥",
          "❤️‍🩹",
          "❤️",
          "🩷",
          "🧡",
          "💛",
          "💚",
          "💙",
          "🩵",
          "💜",
          "🤎",
          "🖤",
          "🩶",
          "🤍",
        ]
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)] //
        m.react(randomReaction)
      }
    }

    //=================================WORKTYPE===========================================
    // ✅ Nouvelle logique de filtrage améliorée
    function shouldProcessMessage() {
      // Si c'est le propriétaire, toujours traiter
      if (isOwner) return true

      // Gestion des modes spéciaux
      if (config.ONLY_GROUP === "true" && !isGroup) return false
      if (config.ONLY_INBOX === "true" && isGroup) return false

      // Gestion des groupes
      if (isGroup && config.GROUP_MODE === "false") return false

      // Gestion des chaînes
      if (isChannel && config.CHANNEL_MODE === "false") return false

      // Gestion du mode général
      switch (config.MODE.toLowerCase()) {
        case "private":
          return false // Seul le propriétaire peut utiliser
        case "public":
          return true // Tout le monde peut utiliser
        case "groups":
          return isGroup || isChannel // Seulement dans les groupes/chaînes
        case "inbox":
          return !isGroup && !isChannel // Seulement en privé
        default:
          return true
      }
    }

    // ✅ Appliquer le filtre
    if (!shouldProcessMessage()) return

    // ✅ Log pour debug
    if (isGroup) {
      console.log(`📱 Message de groupe: ${groupName} | Utilisateur: ${pushname}`)
    }
    if (isChannel) {
      console.log(`📢 Message de chaîne | Utilisateur: ${pushname}`)
    }

    const events = require("./command")
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false
    if (isCmd) {
      const cmd =
        events.commands.find((cmd) => cmd.pattern === cmdName) ||
        events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
      if (cmd) {
        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })

        try {
          cmd.function(conn, mek, m, {
            from,
            quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            isChannel,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
          })
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e)
        }
      }
    }
    events.commands.map(async (command) => {
      if (body && command.on === "body") {
        command.function(conn, mek, m, {
          from,
          l,
          quoted,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          isChannel,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        })
      } else if (mek.q && command.on === "text") {
        command.function(conn, mek, m, {
          from,
          l,
          quoted,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          isChannel,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        })
     // ❌ ANCIEN CODE PROBLÉMATIQUE
  
  // ✅ NOUVEAU CODE CORRIGÉ
} else if (
  (command.on === "image" || command.on === "photo") &&
  (type === "imageMessage" || m.imageMessage) // ← CORRECTION
) 
{
        command.function(conn, mek, m, {
          from,
          l,
          quoted,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          isChannel,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        })
       } else if (
  command.on === "sticker" &&
  (type === "stickerMessage" || m.stickerMessage) // ← CORRECTION
) 
{
        command.function(conn, mek, m, {
          from,
          l,
          quoted,
          body,
          isCmd,
          command,
          args,
          q,
          isGroup,
          isChannel,
          sender,
          senderNumber,
          botNumber2,
          botNumber,
          pushname,
          isMe,
          isOwner,
          groupMetadata,
          groupName,
          participants,
          groupAdmins,
          isBotAdmins,
          isAdmins,
          reply,
        })
      }
    })
  })
}

app.get("/", (req, res) => {
  res.send("HEY, TREND-X STARTED ✅")
})
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`))
setTimeout(() => {
  connectToWA()
}, 4000)
