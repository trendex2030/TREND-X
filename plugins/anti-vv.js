const { ven } = require("../trend");

ven({
  pattern: "vv",
  alias: ["viewonce", 'retrive'],
  react: '🐳',
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply, isOwner }) => {
  try {
    if (!isOwner) {
      return await reply("*📛 This is an owner command.*");
    }

    if (!m.quoted) {
      return await reply("*🍁 Please reply to a view once message!*");
    }

    // Vérifier si c'est un message view-once
    if (!m.quoted.viewOnce && !m.quoted.message?.viewOnceMessage) {
      return await reply("*❌ This is not a view-once message!*");
    }

    const quotedMsg = m.quoted.message?.viewOnceMessage?.message || m.quoted.message;
    const buffer = await m.quoted.download();
    
    if (!buffer) {
      return await reply("*❌ Failed to download media!*");
    }

    let messageContent = {};
    
    if (quotedMsg.imageMessage) {
      messageContent = {
        image: buffer,
        caption: quotedMsg.imageMessage.caption || '*🔓 View-once image retrieved*',
        mimetype: quotedMsg.imageMessage.mimetype || "image/jpeg"
      };
    } else if (quotedMsg.videoMessage) {
      messageContent = {
        video: buffer,
        caption: quotedMsg.videoMessage.caption || '*🔓 View-once video retrieved*',
        mimetype: quotedMsg.videoMessage.mimetype || "video/mp4"
      };
    } else if (quotedMsg.audioMessage) {
      messageContent = {
        audio: buffer,
        mimetype: "audio/ogg; codecs=opus",
        ptt: quotedMsg.audioMessage.ptt || false
      };
    } else {
      return await reply("❌ Only image, video, and audio view-once messages are supported");
    }

    await conn.sendMessage(from, messageContent, { quoted: mek });
    
  } catch (error) {
    console.error("VV Error:", error);
    await reply("❌ Error retrieving view-once message:\n" + error.message);
  }
});
