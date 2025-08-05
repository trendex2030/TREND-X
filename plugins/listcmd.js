const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');
const moment = require('moment-timezone');

cmd({
  pattern: "listmenu",
  alias: ["commandlist", "help"],
  desc: "Fetch and display all available bot commands",
  category: "system",
  filename: __filename,
}, async (Void, m, text, { prefix }) => {
  try {
    const commandDir = path.join(__dirname, '../plugins');
    const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));

    let totalCommands = 0;
    let commandList = [];

    for (const file of commandFiles) {
      const filePath = path.join(commandDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = content.match(/pattern:\s*["'`](.*?)["'`]/g);
      
      if (matches) {
        const extracted = matches.map(x => x.split(':')[1].replace(/["'`,]/g, '').trim());
        totalCommands += extracted.length;
        commandList.push(`📁 *${file}*\n${extracted.map(cmd => `╰➤ \`${prefix}${cmd}\``).join('\n')}`);
      }
    }

    const time = moment().tz('Africa/Nairobi').format('HH:mm:ss');
    const date = moment().tz('Africa/Nairobi').format('dddd, MMMM Do YYYY');

    const caption = `╭━━〔 *CASEYRHODES-XMD* 〕━━⬣
┃ 👑 *Total Commands:* ${totalCommands}
┃ 📅 *Date:* ${date}
┃ ⏰ *Time:* ${time}
┃ 🤖 *Prefix:* ${prefix}
╰━━━━━━━━━━━━━━━━━━━━⬣\n\n${commandList.join('\n\n')}`;

    await Void.sendMessage(m.chat, {
      image: { url: "https://files.catbox.moe/y3j3kl.jpg" },
      caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
          newsletterJid:"120363302677217436@newsletter",
          newsletterName: "CASEYRHODES TECH",
          serverMessageId: 2
        },
        externalAdReply: {
          title: "CASEYRHODES TECH",
          body: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄᴀsᴇʏʀʜᴏᴅᴇs ᴛᴇᴄʜ`,
          mediaType: 1,
          sourceUrl: "https://github.com/caseyweb/CASEYRHODES-XMD",
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      }
    }, { quoted: {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
      },
      message: {
        contactMessage: {
          displayName: "CASEYRHODES-XMD | Powered by Caseyrhodes ✅",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:CASEYRHODES TECH | Pkdriller\nORG: Caseyrhodes ✅;\nTEL;type=CELL;type=VOICE;waid=254112192119:+254 112 192119\nEND:VCARD`,
          jpegThumbnail: Buffer.alloc(0)
        }
      }
    }});
  } catch (err) {
    console.error(err);
    await m.reply('❌ Error: Could not fetch the command list.');
  }
});
