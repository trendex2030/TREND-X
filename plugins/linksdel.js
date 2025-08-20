const {
  cmd
} = require('../command');
const config = require('../config');
const linkPatterns = [
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi, 
  /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/, 
  /wa\.me\/\S+/gi, 
  /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi, 
  /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi, 
  /https?:\/\/youtu\.be\/\S+/gi, 
  /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi, 
  /https?:\/\/fb\.me\/\S+/gi, 
  /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi, 
  /https?:\/\/ngl\/\S+/gi, 
  /https?:\/\/(?:www\.)?discord\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi, 
  /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi, 
  /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
];

cmd({
  'on': 'body'
}, async (message, client, args, {
  from: chatId,
  body: text,
  sender: sender,
  isGroup: isGroup,
  isAdmins: isAdmin,
  isBotAdmins: isBotAdmin
}) => {
  try {
    if (!isGroup || isAdmin || !isBotAdmin) {
      return;
    }
    const containsLink = linkPatterns.some(pattern => pattern.test(text));
    if (containsLink && config.DELETE_LINKS === 'true') {
      await client.sendMessage(chatId, {
        'delete': message.key
      }, {
        'quoted': message
      });
    }
  } catch (error) {
    console.error(error);
  }
});
