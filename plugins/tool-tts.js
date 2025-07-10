const axios = require('axios');
const config = require('../settings')
const {ven , commands} = require('../hisoka')
const googleTTS = require('google-tts-api')

ven({
    pattern: "tts",
    desc: "download songs",
    category: "download",
    react: "👧",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("Need some text.")
    const url = googleTTS.getAudioUrl(q, {
  lang: 'FR-fr',
  slow: false,
  host: 'https://translate.google.com',
})
const contextInfo = {
    mentionedJid: [mek.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363400575205721@newsletter',
        newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
        serverMessageId: 143,
    },
};

await conn.sendMessage(from, { 
    audio: { url: url }, 
    mimetype: 'audio/mpeg', 
    ptt: true,
    contextInfo: contextInfo
}, { quoted: mek })
    }catch(a){
reply(`${a}`)
}
})
