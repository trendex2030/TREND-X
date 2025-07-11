const { v4: uuidv4 } = require('uuid'); // install uuid if needed

cmd({
    pattern: "menu",
    alias: ["list"],
    desc: "bot's commands",
    react: "📜",
    category: "main"
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        let sessionId = uuidv4(); // Unique session ID for this menu
        let desc = `*👋 Hello ${pushname}*

*╭─「 ${config.TREND_X || "TREND-X"} 」*
*│◈ ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())}*
*│◈ ʀᴀᴍ ᴜꜱᴀɢᴇ : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB*
*│◈ ᴘʟᴀᴛꜰᴏʀᴍ : ${os.hostname()}*
*│◈ ᴠᴇʀꜱɪᴏɴ : 3.0.0*
*╰──────────●●►*

*╭╼╼╼╼╼╼╼╼╼╼*
*├ 1 • MAIN*
*├ 2 • SEARCH*
*├ 3 • DOWNLOAD*
*├ 4 • GROUP*
*├ 5 • OWNER*
*├ 6 • FUN*
*╰╼╼╼╼╼╼╼╼╼╼*

_*🌟 Reply with the Number you want to select*_

> *𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔 TREND-X*`;

        const sent = await conn.sendMessage(from, {
            image: { url: config.MENU_IMG },
            caption: desc
        }, { quoted: mek });

        const listener = async (msgUpdate) => {
            const msg = msgUpdate.messages?.[0];
            if (!msg?.message?.extendedTextMessage) return;
            if (!msg.message.extendedTextMessage.contextInfo) return;

            // Check if reply is to the menu message
            const ctx = msg.message.extendedTextMessage.contextInfo;
            if (ctx.stanzaId !== sent.key.id) return;

            let selected = msg.message.extendedTextMessage.text.trim();

            const options = {
                '1': mainCommands,
                '2': searchCommands,
                '3': downloadCommands,
                '4': groupCommands,
                '5': ownerCommands,
                '6': funCommands
            };

            if (options[selected]) {
                await reply(options[selected]);
            } else {
                await reply('❌ Invalid option. Please select a valid number (1–6).');
            }

            // Clean up listener
            conn.ev.off('messages.upsert', listener);
        };

        conn.ev.on('messages.upsert', listener);

        // Define your command messages below for better structure
        const mainCommands = `
╔════════════════════════╗  
║ 🔧 **MAIN COMMANDS** 🔧 ║  
╚════════════════════════╝  
┃ ◈ alive ◈ menu ◈ menu2
┃ ◈ system ◈ ping ◈ runtime
┃ ◈ jid
📊 *Total: 7*
        `;

        const searchCommands = `
╔════════════════════════╗  
║ 🔍 **SEARCH COMMANDS** ║  
╚════════════════════════╝  
┃ ◈ yts ◈ image
📊 *Total: 2*
        `;

        const downloadCommands = `
╔════════════════════════╗  
║ 📥 **DOWNLOAD COMMANDS** ║  
╚════════════════════════╝  
┃ ◈ apk ◈ twitter ◈ mediafire
┃ ◈ fb ◈ play ◈ play2 ◈ video
┃ ◈ video2 ◈ yta ◈ ytmp3 ◈ tiktok
📊 *Total: 12*
        `;

        const groupCommands = `
╔════════════════════════╗  
║ 👥 **GROUP COMMANDS** 👥 ║  
╚════════════════════════╝  
┃ ◈ mute ◈ unmute ◈ promote ◈ demote
┃ ◈ del ◈ add ◈ tagall ◈ groupdesc
┃ ◈ groupinfo ◈ setsubject ◈ hidetag
┃ ◈ unlock ◈ lock ◈ join ◈ leave
📊 *Total: 20*
        `;

        const ownerCommands = `
╔════════════════════════╗  
║ 👑 **OWNER COMMANDS** 👑 ║  
╚════════════════════════╝  
┃ ◈ shutdown ◈ alive ◈ clearchats
┃ ◈ repo ◈ block ◈ unblock
┃ ◈ owner ◈ ping ◈ owner2
📊 *Total: 9*
        `;

        const funCommands = `
╔════════════════════════╗  
║ 🎉 **FUN COMMANDS** 🎉 ║  
╚════════════════════════╝  
┃ ◈ joke ◈ flirt ◈ truth ◈ dare
┃ ◈ fact ◈ spam ◈ repeat ◈ pickupline
📊 *Total: 10*
        `;

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('An error occurred while processing your request.');
    }
});
