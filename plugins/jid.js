const { cmd } = require('../command');

// JID
cmd({
    pattern: "jid",
    desc: "Get the JID of the user or group.",
    react: "📍",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, sender, isOwner, isAdmins, reply }) => {
    try {
        if (isGroup) {
            if (!isAdmins && !isOwner) {
                return reply("⚠️ Only group admins or the bot owner can use this command.");
            }
            return reply(`Group JID: *${from}*`);
        } else {
            if (!isOwner) {
                return reply("⚠️ Only the bot owner can use this command in private chat.");
            }
            return reply(`User JID: *${sender}*`);
        }
    } catch (e) {
        console.error("Error:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});

// JID2
cmd({
    pattern: "jid2",
    desc: "Get the JID of the user or group.",
    react: "📍",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, sender, isOwner, isAdmins, reply }) => {
    try {
        if (isGroup) {
            if (!isAdmins && !isOwner) {
                return reply("⚠️ Only group admins or the bot owner can use this command.");
            }
            return reply(`Group JID: *${from}*`);
        } else {
            if (!isOwner) {
                return reply("⚠️ Only the bot owner can use this command in private chat.");
            }
            return reply(`User JID: *${sender}*`);
        }
    } catch (e) {
        console.error("Error:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
