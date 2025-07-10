const { ven } = require('../hisoka');
const os = require('os');
const { runtime } = require('../lib/functions');
const config = require('../settings');
const { createBox, successBox } = require('../lib/msg-formatter')

ven({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check if bot is alive and running",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
        const uptime = runtime(process.uptime());

 const caption = `
█▓▒▒〔 🕶️ *${config.BOT_NAME}* 〕▒▒▓█
█ ⚡ *En ligne & opérationnel*
█ 👑 *Owner:* ${config.OWNER_NAME}
█ 🔖 *Version:* ${config.version}
█ 🛠️ *Préfixe:* ${config.PREFIX}
█ ⚙️ *Mode:* ${config.MODE}
█ 💾 *RAM:* ${heapUsed}MB / ${totalMem}MB
█ 🖥️ *Hôte:* ${os.hostname()}
█ ⏱️ *Uptime:* ${uptime}
█████████████████████████████
📝 *${config.DESCRIPTION}*
`.trim();

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363400575205721@newsletter',
                    newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`❌ *Error:* ${e.message}`);
    }
});