const { cmd } = require('../command');

cmd({
    pattern: "test",
    alias: [],
    use: '.test',
    desc: "Send a random voice note from URL.",
    category: "fun",
    react: "🎙️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const songUrls = [
            "https://files.catbox.moe/dcxfi1.mp3",
            "https://files.catbox.moe/ebkzu5.mp3",
            "https://files.catbox.moe/iq4ouj.mp3"
            // Add more direct URLs here
        ];

        if (!songUrls.length) return reply("No song URLs configured.");

        const randomUrl = songUrls[Math.floor(Math.random() * songUrls.length)];

        // Fake verified contact as quoted message
        const fakeContact = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "CASEYRHODES-XMD VERIFIED ✅",
                    vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:CASEYRHODES-XMD\nORG:CASEYRHODES;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254700000000\nEND:VCARD"
                }
            }
        };

        await conn.sendMessage(from, {
            audio: { url: randomUrl },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363302677217436@newsletter',
                    newsletterName: "CASEYRHODES TECH 👻",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "CASEYRHODES-XMD",
                    body: "Multi-Device WhatsApp Bot",
                    thumbnailUrl: "https://files.catbox.moe/y3j3kl.jpg",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    sourceUrl: "https://github.com/caseyweb/CASEYRHODES-XMD"
                }
            }
        }, { quoted: fakeContact });

    } catch (e) {
        console.error("Error in test command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
