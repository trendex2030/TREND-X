const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "wastalk",
    desc: "Fetch WhatsApp channel info using a given URL",
    category: "main",
    react: "🪀",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const url = q || (quoted?.text ?? "").trim();

        if (!url || !url.includes("whatsapp.com/channel/")) {
            return reply(`Please provide a valid WhatsApp Channel URL.\n\n*Example:* .wastalk https://whatsapp.com/channel/0029VakUEfb4o7qVdkwPk83E`);
        }

        const res = await axios.get(`https://apis-keith.vercel.app/stalker/wachannel?url=${encodeURIComponent(url)}`);
        const data = res.data;

        if (!data.status) {
            return reply("Failed to fetch channel data. Please try again later.");
        }

        const result = data.result;

        const caption = `🔍 *WhatsApp Channel Info*\n\n` +
                        `*📛 Title:* ${result.title}\n` +
                        `*🧑‍🤝‍🧑 Followers:* ${result.followers}\n\n` +
                        `*📝 Description:*\n${result.description}`;

        await conn.sendMessage(from, {
            image: { url: result.img },
            caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363302677217436@newsletter',
                    newsletterName: 'CASEYRHODES TECH 👻',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("WAStalk Error:", err);
        reply("Something went wrong while fetching the channel info.");
    }
});
