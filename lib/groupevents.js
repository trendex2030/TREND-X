


const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../settings');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: 'null',
            newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
            serverMessageId: 143,
        },
    };
};

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://files.catbox.moe/fuj1oz.jpg',
    'https://files.catbox.moe/481dsf.jpg',
];

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            if (update.action === "add" && config.WELCOME === "true") {
                const WelcomeText = `✨ Oh... a new toy? @${userName} 💫

Welcome to *${metadata.subject}* 🎪  
You are the *#${groupMembersCount}* to join my little game... how *delightful* 💋

🕒 *Arrived at:* ${timestamp}  
📌 *About this circus:*  
${desc || "No secrets revealed... yet."}

Now be a good participant... and don't bore me too soon.  
🎭 *Hisoka is watching... powered by ${config.BOT_NAME}*`;

await conn.sendMessage(update.id, {
  image: { url: ppUrl },
  caption: WelcomeText,
  mentions: [num],
  contextInfo: getContextInfo({ sender: num }),
});

} else if (update.action === "remove" && config.WELCOME === "true") {
  const GoodbyeText = `😢 @${userName} has vanished from the game...

🕒 *Time of disappearance:* ${timestamp}  
👥 *Remaining contestants:* ${groupMembersCount}  

Some toys just break too easily...  
🎭 *${config.BOT_NAME} sighs with disappointment.*`;
  
  await conn.sendMessage(update.id, {
    image: { url: ppUrl },
    caption: GoodbyeText,
    mentions: [num],
    contextInfo: getContextInfo({ sender: num }),
  });

} else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
  const demoter = update.author.split("@")[0];
  const DemoteText = `🔻 *A fall from grace...*

@${demoter} has stripped @${userName} of their admin powers.

🕒 *Marked at:* ${timestamp}  
🎭 *Such fragile status... don’t you think?*
📢 *Group:* ${metadata.subject}`;
  
  await conn.sendMessage(update.id, {
    text: DemoteText,
    mentions: [update.author, num],
    contextInfo: getContextInfo({ sender: update.author }),
  });

} else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
  const promoter = update.author.split("@")[0];
  const PromoteText = `🛡️ *A new puppet master has emerged...*

@${promoter} has *elevated* @${userName} to admin.

🕒 *Time of ascension:* ${timestamp}  
📢 *Group:* ${metadata.subject}  
🎭 Let’s see how long this one lasts…`;
  
  await conn.sendMessage(update.id, {
    text: PromoteText,
    mentions: [update.author, num],
    contextInfo: getContextInfo({ sender: update.author }),
  });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
