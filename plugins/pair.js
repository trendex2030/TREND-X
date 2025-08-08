const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for TREND-X bot",
    category: "download",
    use: ".pair 254700123456",
    filename: __filename
}, 
async (Void, citel, text) => {
    try {
        const phoneNumber = text ? text.trim().replace(/[^0-9]/g, '') : citel.sender.replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await citel.reply("❌ Please provide a valid phone number without `+`\nExample: `.pair 254700123456`");
        }

        const res = await axios.get(`https://six391-wkgc.onrender.com/code?number=${encodeURIComponent(phoneNumber)}`);
        if (!res.data || !res.data.code) {
            return await citel.reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = res.data.code;

        const codeMessage = `
╭─〔 *TREND-X PAIRING SUCCESSFUL* 〕
│
├─ *📱 Number:* ${phoneNumber}
├─ *🔗 Pairing Code:* ${pairingCode}
│
╰─ *🚀 Powered by TREND-X tech*
`.trim();

        await citel.reply(codeMessage);

        // Optional: Add quick reply button
        await Void.sendMessage(citel.chat, {
            text: "Tap below to copy the code:",
            footer: 'Pairing successful!',
            templateButtons: [
                {
                    index: 1,
                    quickReplyButton: {
                        displayText: "📋 Copy Code",
                        id: `.copy ${pairingCode}`
                    }
                }
            ]
        }, { quoted: citel });

    } catch (error) {
        console.error("❌ Pair command error:", error);
        await citel.reply("❌ Error retrieving pairing code. Try again later.");
    }
});
