const config = require('../config')
const {cmd , commands} = require('../command')
cmd({
    pattern: "about",
    alias: ["trendex","whois"], 
    react: "👑",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let about = `
*╭━━〔 TREND X 〕━━┈⊷*

*👋 HELLO ${pushname}*

*╰──────────────┈⊷*
*╭━━━〔 MY ABOUT 〕━━━┈⊷*
*┃★╭──────────────*
*┃★│* *ᴡᴇʟᴄᴏᴍᴇ ɪᴛs TREND-x-ʙᴏᴛ*
*┃★│* *ᴄʀᴇᴀᴛᴇʀ : TRENDEX*
*┃★│* *ʀᴇᴀʟ ɴᴀᴍᴇ : TRENDEX KING*
*┃★│* *ᴘᴜʙʟɪᴄ ɴᴀᴍᴇ : TREND-X*
*┃★│* *ᴀɢᴇ : 19 ʏᴇᴀʀ*
*┃★│* *ᴄɪᴛʏ : MOMBASA*
*┃★│* *ᴀ sɪᴍᴘʟᴇ ᴡʜᴀᴛsᴀᴘᴘ ᴅᴇᴠᴇʟᴘᴏʀ*
*┃★╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*
> *◆◆◆◆◆◆◆◆◆◆◆◆*

*[ • SPECIAL THANKS FOR • ]*
*╭━━━〔 THANKS TO 〕━━━┈⊷*
*┃★╭──────────────*
*┃★│* *▢DIANA(BUGBOT DEV)*
*┃★│* *▢TRENDEX(TOP-NOTCH)*
*┃★│* *▢IANOH(MAKALI SULTAN)*
*┃★│* *▢DEMMY(BIG MEECH)*
*┃★│* *▢HISOKA(ᴅᴊ)*
*┃★│* *▢MALVIN*
*┃★╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*

*•────────────•⟢*
> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ TREND X
*•────────────•⟢*
`

await conn.sendMessage(from,{image:{url:`https://files.catbox.moe/adymbp.jpg`},caption:about,
                             contextInfo: {
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363401765045963@newsletter',
      newsletterName: 'TREND-X',
      serverMessageId: 999
    }
  }
}, { quoted: mek });
} catch (e) {
console.log(e)
reply(`${e}`)
}
})
