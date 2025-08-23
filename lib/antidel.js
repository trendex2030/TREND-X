const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../config');

// Newsletter configuration
const NEWSLETTER_CONFIG = {
    jid: '120363401765045963@newsletter',
    name: 'TREND-X 𝐀𝐍𝐓𝐈𝐃𝐄𝐋𝐄𝐓𝐄 🌟',
    serverMessageId: 143,
    imageUrl: 'https://files.catbox.moe/adymbp.jpg',
    watermark: '> POWERED BY TREND-X TECH'
};

const getNewsletterContext = () => ({
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: NEWSLETTER_CONFIG.jid,
        newsletterName: NEWSLETTER_CONFIG.name,
        serverMessageId: NEWSLETTER_CONFIG.serverMessageId
    }
});

const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    try {
        // Extract message content with comprehensive fallbacks
        const messageContent = mek.message?.conversation 
            || mek.message?.extendedTextMessage?.text
            || mek.message?.imageMessage?.caption
            || mek.message?.videoMessage?.caption
            || mek.message?.documentMessage?.caption
            || '🚫 Content unavailable (may be media without caption)';
        
        // Enhanced delete info with newsletter branding
        const fullMessage = `
${deleteInfo}

📝 *Message Content:*
${messageContent}

${NEWSLETTER_CONFIG.watermark}`;

        const mentionedJids = isGroup 
            ? [update.key.participant, mek.key.participant].filter(Boolean) 
            : [update.key.remoteJid].filter(Boolean);

        await conn.sendMessage(
            jid,
            {
                image: { url: NEWSLETTER_CONFIG.imageUrl },
                caption: fullMessage,
                contextInfo: {
                    ...getNewsletterContext(),
                    mentionedJid: mentionedJids,
                },
            },
            { quoted: mek }
        );
    } catch (error) {
        console.error('Error in DeletedText:', error);
    }
};

const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    try {
        const antideletedmek = structuredClone(mek.message);
        const messageType = Object.keys(antideletedmek)[0];
        
        const mediaTypes = {
            imageMessage: { type: 'image', key: 'imageMessage' },
            videoMessage: { type: 'video', key: 'videoMessage' },
            audioMessage: { type: 'audio', key: 'audioMessage' },
            documentMessage: { type: 'document', key: 'documentMessage' },
            stickerMessage: { type: 'sticker', key: 'stickerMessage' }
        };

        const currentType = mediaTypes[messageType];
        
        if (currentType) {
            // Enhanced media message with newsletter header image
            const caption = `
${deleteInfo}

${NEWSLETTER_CONFIG.watermark}`;

            if (['image', 'video'].includes(currentType.type)) {
                const mediaUrl = antideletedmek[currentType.key]?.url 
                    || NEWSLETTER_CONFIG.imageUrl;
                
                await conn.sendMessage(jid, { 
                    [currentType.type]: { url: mediaUrl },
                    caption: caption,
                    contextInfo: {
                        ...getNewsletterContext(),
                        mentionedJid: [mek.sender],
                    }
                }, { quoted: mek });
            } 
            else {
                // For non-visual media, send with header image first
                await conn.sendMessage(jid, { 
                    image: { url: NEWSLETTER_CONFIG.imageUrl },
                    caption: `*⚠️ Deleted ${currentType.type.toUpperCase()} Alert 🚨*`,
                    contextInfo: getNewsletterContext()
                });
                
                await conn.sendMessage(jid, { 
                    text: caption,
                    contextInfo: getNewsletterContext()
                }, { quoted: mek });
                
                // Attempt to resend the original media if possible
                if (antideletedmek[currentType.key]?.url) {
                    await conn.sendMessage(jid, {
                        [currentType.type]: { url: antideletedmek[currentType.key].url },
                        contextInfo: getNewsletterContext()
                    }, { quoted: mek });
                }
            }
        } else {
            // Fallback for unsupported media types with newsletter branding
            antideletedmek[messageType].contextInfo = {
                ...getNewsletterContext(),
                stanzaId: mek.key.id,
                participant: mek.sender,
                quotedMessage: mek.message,
            };
            await conn.relayMessage(jid, antideletedmek, {});
        }
    } catch (error) {
        console.error('Error in DeletedMedia:', error);
    }
};

const AntiDelete = async (conn, updates) => {
    try {
        for (const update of updates) {
            if (update.update.message === null) {
                const store = await loadMessage(update.key.id);

                if (store && store.message) {
                    const mek = store.message;
                    const isGroup = isJidGroup(store.jid);
                    const antiDeleteStatus = await getAnti();
                    if (!antiDeleteStatus) continue;

                    const deleteTime = new Date().toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    });
                    const deleteDate = new Date().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    });

                    let deleteInfo, jid;
                    if (isGroup) {
                        const groupMetadata = await conn.groupMetadata(store.jid);
                        const groupName = groupMetadata.subject;
                        const sender = mek.key.participant?.split('@')[0] || 'Unknown';
                        const deleter = update.key.participant?.split('@')[0] || 'Unknown';

                        deleteInfo = `*🔰 𝐀𝐍𝐓𝐈𝐃𝐄𝐋𝐄𝐓𝐄 𝐑𝐄𝐏𝐎𝐑𝐓 🔰*
*├📅 DATE:* ${deleteDate}
*├⏰ TIME:* ${deleteTime}
*├👤 SENDER:* @${sender}
*├👥 GROUP:* ${groupName}
*├🗑️ DELETED BY:* @${deleter}
*├📌 MESSAGE TYPE:* ${getMessageType(mek.message)}
*╰⚠️ ACTION:* Message Deletion Detected`;
                        jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : store.jid;
                    } else {
                        const senderNumber = mek.key.remoteJid?.split('@')[0] || 'Unknown';
                        
                        deleteInfo = `*🔰 𝐀𝐍𝐓𝐈𝐃𝐄𝐋𝐄𝐓𝐄 𝐑𝐄𝐏𝐎𝐑𝐓 🔰*
*├📅 DATE:* ${deleteDate}
*├⏰ TIME:* ${deleteTime}
*├📱 SENDER:* @${senderNumber}
*├📌 MESSAGE TYPE:* ${getMessageType(mek.message)}
*╰⚠️ ACTION:* Message Deletion Detected`;
                        jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : update.key.remoteJid;
                    }

                    // Add newsletter footer
                    deleteInfo += `\n\n${NEWSLETTER_CONFIG.watermark}`;

                    if (mek.message?.conversation || mek.message?.extendedTextMessage || 
                        mek.message?.imageMessage?.caption || mek.message?.videoMessage?.caption) {
                        await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                    } else {
                        await DeletedMedia(conn, mek, jid, deleteInfo);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in AntiDelete:', error);
    }
};

function getMessageType(message) {
    if (!message) return 'Unknown';
    
    const type = Object.keys(message)[0];
    const typeMap = {
        conversation: 'Text',
        imageMessage: 'Image',
        videoMessage: 'Video',
        audioMessage: 'Audio',
        documentMessage: 'Document',
        stickerMessage: 'Sticker',
        extendedTextMessage: 'Text with Link',
        contactMessage: 'Contact',
        locationMessage: 'Location'
    };
    
    return typeMap[type] || type.replace('Message', '') || 'Unknown';
}

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};
