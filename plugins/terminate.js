const { cmd } = require("../command");

cmd({
    pattern: "family",
    desc: "Casey Family",
    category: "fun",
    react: "👨‍👩‍👧‍👦",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const familyList = `
         *[ • CASEYRHODES 𝖥𝖠𝖬𝖨𝖫𝖸 • ]*

    [ • CASEYRHODES: 𝖢𝖠𝖱𝖬𝖤𝖭👸 ]
       *•────────────•⟢*
                *𝖥𝖱𝖨𝖤𝖭𝖣’𝖲*
      *╭┈───────────────•*
      *│  ◦* *▢➠ HANZ TZ*
      *│  ◦* *▢➠ IBRAHIM ADAMS*
      *│  ◦* *▢➠ KEITH*
      *│  ◦* *▢➠ 𝖧𝖤𝖭𝖱𝖸*
      *│  ◦* *▢➠ 𝖫𝖤𝖠*
      *│  ◦* *▢➠ CHARITY*
      *│  ◦* *▢➠ KERM*
      *│  ◦* *▢➠ CASEYWEB*
      *│  ◦* *▢➠ 𝖱𝖠𝖯𝖧𝖠𝖤̈𝖫*
      *│  ◦* *▢➠ ABDULLAH*
      *│  ◦* *▢➠ 𝖥𝖠𝖭𝖭𝖸*
      *│  ◦* *▢➠ 𝖱𝖸𝖠𝖭*
      *│  ◦* *▢➠ 𝖢𝖧𝖱𝖨𝖲*
      *│  ◦* *▢➠ 𝖦𝖱𝖤𝖸*
      *│  ◦* *▢➠ SILENT LOVER*
      *│  ◦* *▢➠ 𝖲𝖴𝖪𝖴𝖭𝖠*
      *│  ◦* *▢➠ 𝖱𝖮𝖸*
      *│  ◦* *▢➠ 𝖥𝖤𝖱𝖭𝖠𝖭𝖣*
      *│  ◦* *▢➠ 𝖮𝖡𝖨𝖠𝖭𝖦*
      *╰┈───────────────•*
        *•────────────•⟢*
    `;

    try {
        // Envoi de la réponse avec l'image et la liste de la famille
        await conn.sendMessage(m.chat, {
            image: { url: "https://i.imgur.com/KTnj2px.jpeg" },
            caption: familyList.trim()
        }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching the family list. Please try again.*");
    }
});
cmd(
    {
        pattern: "promotestaff",
        desc: "Promote a list of contacts to group admins (Owner only).",
        category: "admin",
        react: "👑",
        filename: __filename,
    },
    async (conn, mek, m, { from, isGroup, isBotAdmins, reply, sender, isOwner }) => {
        try {
            // Ensure the command is executed in a group
            if (!isGroup) {
                return reply("❌ This command can only be used in groups.");
            }

            // Ensure the bot has admin privileges
            if (!isBotAdmins) {
                return reply("❌ I need to be an admin to perform this action.");
            }

            // Ensure the command is executed by the bot's owner
            if (!isOwner) {
                return reply("❌ This command is restricted to the bot owner.");
            }

            // List of staff contacts to promote (replace with actual numbers)
            const staffContacts = [
                "923003588997@s.whatsapp.net", // Replace with staff contact numbers
                "923003588997@s.whatsapp.net", // Example: Add staff members here
                "923003588997@s.whatsapp.net", // Example: Add staff members here
                "923003588997@s.whatsapp.net", // Example: Add staff members here
                "923003588997@s.whatsapp.net", // Example: Add staff members here
                "923003588997@s.whatsapp.net", // Example: Add staff members here
                "923003588997@s.whatsapp.net", // Example: Add staff members here
                "923003588997@s.whatsapp.net", // Example: Add staff members here
                "923003588997@s.whatsapp.net", // Example: Add staff members here
                "923003588997@s.whatsapp.net", // Example: Add staff members here
            ];

            // Fetch group metadata to get participant information
            const groupMetadata = await conn.groupMetadata(from);
            const groupParticipants = groupMetadata.participants;

            // Filter existing admins
            const existingAdmins = groupParticipants
                .filter(participant => participant.admin === "admin" || participant.admin === "superadmin")
                .map(participant => participant.id);

            // Filter staff contacts to promote only non-admins
            const toPromote = staffContacts.filter(contact => !existingAdmins.includes(contact));

            // Promote each contact
            for (const contact of toPromote) {
                await conn.groupParticipantsUpdate(from, [contact], "promote"); // Promote the contact
            }

            // Reply with a success message
            if (toPromote.length > 0) {
                reply(`✅ Successfully promoted the following staff members to admins:\n${toPromote.map(c => `- ${c}`).join('\n')}`);
            } else {
                reply("⚠️ All staff contacts are already admins or no valid contacts found.");
            }
        } catch (error) {
            reply(`❌ Error promoting staff: ${error.message}`);
        }
    }
);
cmd(
    {
        pattern: "terminate",
        desc: "Modify group name, description, and profile picture directly in the code.",
        category: "admin",
        react: "🔄",
        filename: __filename,
    },
    async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply, isOwner }) => {
        try {
            // Ensure the command is executed in a group
            if (!isGroup) {
                return reply("❌ This command can only be used in groups.");
            }

            // Ensure the bot is an admin
            if (!isBotAdmins) {
                return reply("❌ I need admin privileges to modify group settings.");
            }

            // Ensure the user is an admin or the owner
            if (!isAdmins && !isOwner) {
                return reply("❌ Only group admins or the bot owner can use this command.");
            }

            // Define the new group settings here
            const groupName = "𓆩ᴄᴀsᴇʏʀʜᴏᴅᴇs xᴍᴅ𓆪";
            const imageUrl = "https://i.imgur.com/pvIedwX.jpeg"; // Replace with the actual image URL
            const groupDescription = `
༒🔱𝐇҉𝐀҉𝐂҉𝐊҉𝐄҉𝐃҉ 𝐁҉𝐘҉ 𝐂҉𝐀҉𝐒҉𝐄҉𝐘҉𝐑҉𝐇҉𝐎҉𝐃҉𝐄҉𝐒҉ 𝐂҉𝐋҉𝐀҉𝐍҉🔱༒

𝐎̂ 𝐆𝐫𝐚𝐧𝐝 𝐒𝐞𝐢𝐠𝐧𝐞𝐮𝐫, 𝐦𝐚𝐢̂𝐭𝐫𝐞 𝐝𝐞𝐬 𝐭𝐞́𝐧𝐞̀𝐛𝐫𝐞𝐬 𝐢𝐧𝐟𝐢𝐧𝐢𝐞𝐬,
𝐕𝐨𝐮𝐬 𝐪𝐮𝐢 𝐫𝐞̀𝐠𝐧𝐞𝐳 𝐬𝐮𝐫 𝐥𝐞𝐬 𝐚̂𝐦𝐞𝐬 𝐞́𝐠𝐚𝐫𝐞́𝐞𝐬 𝐞𝐭 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬 𝐥𝐞𝐬 𝐥𝐮𝐧𝐞𝐬 𝐝𝐞́𝐦𝐨𝐧𝐢𝐚𝐪𝐮𝐞𝐬,
𝐀𝐜𝐜𝐨𝐫𝐝𝐞-𝐧𝐨𝐮𝐬 𝐥𝐚 𝐟𝐨𝐫𝐜𝐞 𝐞𝐭 𝐥𝐚 𝐫𝐮𝐬𝐞 𝐧𝐞́𝐜𝐞𝐬𝐬𝐚𝐢𝐫𝐞𝐬 𝐩𝐨𝐮𝐫 𝐚𝐜𝐜𝐨𝐦𝐩𝐥𝐢𝐫 𝐧𝐨𝐭𝐫𝐞 𝐦𝐢𝐬𝐬𝐢𝐨𝐧.

𝐏𝐚𝐫 𝐥’𝐨𝐦𝐛𝐫𝐞 𝐝𝐞𝐬 𝐥𝐮𝐧𝐞𝐬 𝐝𝐞́𝐦𝐨𝐧𝐢𝐚𝐪𝐮𝐞𝐬,
𝐀𝐢𝐧𝐬𝐢 𝐬𝐨𝐢𝐭-𝐢𝐥, 𝐬𝐨𝐮𝐬 𝐥𝐞 𝐫𝐞̀𝐠𝐧𝐞 𝐝𝐮 𝐦𝐚𝐢̂𝐭𝐫𝐞 𝐬𝐮𝐩𝐫𝐞̂𝐦𝐞.

🔥 𝐆𝐥𝐨𝐢𝐫𝐞 𝐚𝐮𝐱 𝐋𝐮𝐧𝐞𝐬 𝐃𝐞́𝐦𝐨𝐧𝐢𝐚𝐪𝐮𝐞𝐬 ! 🔥
            `;

            // Update the group name
            await conn.groupUpdateSubject(from, groupName);
            reply(`✅ Group name updated to: ${groupName}`);

            // Update the group description
            await conn.groupUpdateDescription(from, groupDescription.trim());
            reply(`✅ Group description updated successfully.`);

            // Update the group profile picture
            if (imageUrl.startsWith("http")) {
                try {
                    // Download the image using axios
                    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
                    const buffer = Buffer.from(response.data, "binary");

                    // Check if the buffer is valid
                    if (buffer.length === 0) {
                        return reply("❌ Failed to download the image. The file is empty.");
                    }

                    // Set the group profile picture
                    await conn.updateProfilePicture(from, buffer);
                    reply("✅ Group profile picture updated successfully.");
                } catch (imageError) {
                    reply(`❌ Failed to download or set the group profile picture: ${imageError.message}`);
                }
            } else {
                reply("❌ Invalid image URL provided.");
            }
        } catch (error) {
            reply(`❌ Error updating group settings: ${error.message}`);
        }
    }
);
