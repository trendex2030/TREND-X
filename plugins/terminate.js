const { cmd } = require("../command");
const axios = require("axios"); // Required for image download in 'terminate'

// ──『 FAMILY 』──
cmd({
    pattern: "family",
    desc: "Casey Family",
    category: "fun",
    react: "👨‍👩‍👧‍👦",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const familyList = `
         *[ • TREND-X 𝖥𝖠𝖬𝖨𝖫𝖸 • ]*

    [ • TRENDEX: KING👸 ]
       *•────────────•⟢*
                *𝖥𝖱𝖨𝖤𝖭𝖣’𝖲*
      *╭┈───────────────•*
      *│  ◦* *▢➠ MAKALI SULTAN*
      *│  ◦* *▢➠ BIG MEECH*
      *│  ◦* *▢➠ DARLINGTON*
      *│  ◦* *▢➠ NICK*
      *│  ◦* *▢➠ PAPA NICK*
      *│  ◦* *▢➠ REGAN*
      *│  ◦* *▢➠ DIANA*
      *│  ◦* *▢➠ TYPING*
      *│  ◦* *▢➠ OBED*
      *│  ◦* *▢➠ BRAVO*
      *│  ◦* *▢➠ HISOKA*
      *│  ◦* *▢➠ AUDI BELTAH*
      *│  ◦* *▢➠ POPKID*
      *│  ◦* *▢➠ CASEYRHODES*
      *│  ◦* *▢➠ SILENT LOVER*
      *│  ◦* *▢➠ DRIZZY*
      *│  ◦* *▢➠ ALISO*
      *│  ◦* *▢➠ YOU*
      *│  ◦* *▢➠ TRENDEX QUEEN*
      *╰┈───────────────•*
        *•────────────•⟢*
    `;
    try {
        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/adymbp.jpg" },
            caption: familyList.trim()
        }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching the family list. Please try again.*");
    }
});

// ──『 PROMOTE STAFF 』──
cmd({
    pattern: "promotestaff",
    desc: "Promote a list of contacts to group admins (Owner only).",
    category: "admin",
    react: "👑",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, isBotAdmins, reply, sender, isOwner }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to perform this action.");
        if (!isOwner) return reply("❌ This command is restricted to the bot owner.");

        const staffContacts = [
            "254734939236@s.whatsapp.net",
            // Add unique staff JIDs here
        ];

        const groupMetadata = await conn.groupMetadata(from);
        const groupParticipants = groupMetadata.participants;

        const existingAdmins = groupParticipants
            .filter(p => p.admin === "admin" || p.admin === "superadmin")
            .map(p => p.id);

        const toPromote = staffContacts.filter(jid => !existingAdmins.includes(jid));

        for (const jid of toPromote) {
            await conn.groupParticipantsUpdate(from, [jid], "promote");
        }

        if (toPromote.length > 0) {
            reply(`✅ Promoted to admins:\n${toPromote.map(c => `- ${c}`).join('\n')}`);
        } else {
            reply("⚠️ All staff are already admins or no valid contacts found.");
        }
    } catch (error) {
        reply(`❌ Error promoting staff: ${error.message}`);
    }
});

// ──『 TERMINATE GROUP 』──
cmd({
    pattern: "terminate",
    desc: "Modify group name, description, and profile picture directly in the code.",
    category: "admin",
    react: "🔄",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply, isOwner }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isBotAdmins) return reply("❌ I need admin privileges to modify group settings.");
        if (!isAdmins && !isOwner) return reply("❌ Only group admins or the bot owner can use this command.");

        const groupName = "𓆩TREND-X𓆪";
        const imageUrl = "https://files.catbox.moe/adymbp.jpg";
        const groupDescription = `
༒🔱𝐇҉𝐀҉𝐂҉𝐊҉𝐄҉𝐃҉ 𝐁҉𝐘҉ TREND-X҉ 𝐂҉𝐋҉𝐀҉𝐍҉🔱༒

𝐎̂ 𝐆𝐫𝐚𝐧𝐝 𝐒𝐞𝐢𝐠𝐧𝐞𝐮𝐫, 𝐦𝐚𝐢̂𝐭𝐫𝐞 𝐝𝐞𝐬 𝐭𝐞́𝐧𝐞̀𝐛𝐫𝐞𝐬 𝐢𝐧𝐟𝐢𝐧𝐢𝐞𝐬,
𝐕𝐨𝐮𝐬 𝐪𝐮𝐢 𝐫𝐞̀𝐠𝐧𝐞𝐳 𝐬𝐮𝐫 𝐥𝐞𝐬 𝐚̂𝐦𝐞𝐬 𝐞́𝐠𝐚𝐫𝐞́𝐞𝐬,
𝐀𝐜𝐜𝐨𝐫𝐝𝐞𝐳-𝐧𝐨𝐮𝐬 𝐥𝐚 𝐟𝐨𝐫𝐜𝐞 𝐩𝐨𝐮𝐫 𝐚𝐜𝐜𝐨𝐦𝐩𝐥𝐢𝐫 𝐧𝐨𝐭𝐫𝐞 𝐦𝐢𝐬𝐬𝐢𝐨𝐧.

🔥 𝐆𝐥𝐨𝐢𝐫𝐞 𝐚𝐮𝐱 𝐋𝐮𝐧𝐞𝐬 𝐃𝐞́𝐦𝐨𝐧𝐢𝐚𝐪𝐮𝐞𝐬 ! 🔥
        `.trim();

        await conn.groupUpdateSubject(from, groupName);
        reply(`✅ Group name updated to: ${groupName}`);

        await conn.groupUpdateDescription(from, groupDescription);
        reply("✅ Group description updated.");

        const res = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const buffer = Buffer.from(res.data, "binary");

        if (buffer.length === 0) return reply("❌ Failed to download the image.");

        await conn.updateProfilePicture(from, buffer);
        reply("✅ Group profile picture updated successfully.");
    } catch (error) {
        reply(`❌ Error updating group settings: ${error.message}`);
    }
});
