const { cmd } = require('./command');
const moment = require('moment-timezone');

let autoBioInterval = null;
let isAutoBioEnabled = false;

async function updateBio(conn) {
    const now = moment().tz("Africa/Nairobi");
    const timeKE = now.format("HH:mm:ss");
    const dateKE = now.format("DD-MM-YYYY");
    const newStatus = `☠️ TREND-X | 🕒 ${timeKE} | 📅 ${dateKE}`;

    try {
        await conn.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(newStatus, 'utf-8'),
            }],
        });
        console.log(`[AUTO-BIO] Updated status to: ${newStatus}`);
    } catch (err) {
        console.error('[AUTO-BIO] Failed to update status:', err.message);
    }
}

cmd({
    pattern: "autobio",
    alias: ["setbio"],
    desc: "Toggle TREND-X autobio with Nairobi time & date",
    category: "settings",
    use: ".autobio on / off",
    filename: __filename,
}, async (conn, mek, m, { text, reply }) => {
    const command = text?.toLowerCase();

    if (!command || !['on', 'off'].includes(command)) {
        return reply("Usage: `.autobio on` or `.autobio off`");
    }

    if (command === 'on') {
        if (isAutoBioEnabled) return reply("✅ Auto Bio already running.");
        isAutoBioEnabled = true;
        autoBioInterval = setInterval(() => updateBio(conn), 60 * 1000);
        await updateBio(conn);
        reply("✅ TREND-X ☠️ Auto Bio activated.");
    } else if (command === 'off') {
        if (!isAutoBioEnabled) return reply("❌ Auto Bio already off.");
        isAutoBioEnabled = false;
        clearInterval(autoBioInterval);
        autoBioInterval = null;
        reply("🛑 TREND-X ☠️ Auto Bio deactivated.");
    }
});
