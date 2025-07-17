const fs = require('fs');
const config = require('../settings');
const { ven, commands } = require('../trend');
const axios = require('axios');
const { createBox, infoBox, createFooter } = require('../lib/msg-formatter');

ven({
    pattern: "menu",
    react: "🤖",
    alias: ["allmenu"],
    desc: "Get command list",
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, pushname, reply
}) => {
    try {
        let menu = {
            download: '', group: '', fun: '', owner: '',
            ai: '', anime: '', convert: '', reaction: '',
            main: '', other: ''
        };

        for (let i = 0; i < commands.length; i++) {
            let cmd = commands[i];
            if (cmd.pattern && !cmd.dontAddCommandList && menu.hasOwnProperty(cmd.category)) {
                menu[cmd.category] += `┃ ⬡ ${cmd.pattern}\n`;
            }
        }

        const madeMenu = `┏━━━━━❰ 『 『TREND-X』 』  ❱━━━━━┓

   𝙃𝙚𝙮, 𝙩𝙧𝙖𝙫𝙚𝙡𝙚𝙧 *${pushname}*...  
   𝙃𝙚𝙧𝙚'𝙨 𝙮𝙤𝙪𝙧 𝙢𝙖𝙥 𝙩𝙤 𝙩𝙝𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨 𝙤𝙛 𝙩𝙝𝙚 𝙬𝙤𝙧𝙡𝙙.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 𝙐𝙨𝙚𝙧: ${pushname}  
🌐 𝙈𝙤𝙙𝙚: [${config.MODE}]  
✨ 𝙋𝙧𝙚𝙛𝙞𝙭: [${config.PREFIX}]  
📦 𝙏𝙤𝙩𝙖𝙡 𝘾𝙤𝙢𝙢𝙖𝗻𝗱𝘀: ${commands.length}  
📌 𝙑𝙚𝙧𝙨𝙞𝙤𝗻: ${config.version} BETA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【 ✦ 】 🛠️ 𝘼𝗱𝗺𝗶𝗻 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.group || '│ ❌ Aucune commande trouvée'}

【 ✧ 】 📥 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.download || '│ ❌ Aucune commande trouvée'}

【 ✦ 】 🚀 𝙈𝗮𝗶𝗻 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.main || '│ ❌ Aucune commande trouvée'}

【 ✧ 】 🎭 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.reaction || '│ ❌ Aucune commande trouvée'}

【 ✦ 】 👑 𝗢𝘄𝗻𝗲𝗿 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.owner || '│ ❌ Aucune commande trouvée'}

【 ✧ 】 🧠 𝗔𝗜 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.ai || '│ ❌ Aucune commande trouvée'}

【 ✦ 】 ✨ 𝗟𝗼𝗴𝗼/𝗔𝗻𝗶𝗺𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.anime || '│ ❌ Aucune commande trouvée'}

【 ✧ 】 🔄 𝗖𝗼𝗻𝘃𝗲𝗿𝘁 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.convert || '│ ❌ Aucune commande trouvée'}

【 ✦ 】 🎉 𝙁𝘂𝗻 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀  
${menu.fun || '│ ❌ Aucune commande trouvée'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ  ${config.OWNER_NAME}*

╰━═☆ 『 『TREND-X』 』 𝙈𝗮𝘀𝘁𝗲𝗿 𝗼𝗳 𝘁𝗵𝗲 𝗖𝗼𝗱𝗲 ☆═━╯`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: madeMenu,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363401765045963@newsletter',
                        newsletterName: 'TREND-X',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        const { errorBox } = require('../lib/msg-formatter');
        reply(errorBox(
            '🔄 Erreur lors du chargement du menu\n' +
            '💡 Réessayez plus tard',
            '❌ ERREUR MENU'
        ));
    }
});
