const { ven } = require('../hisoka');
const config = require('../settings');
const axios = require('axios');

// Téléchargement VV (statut WhatsApp)
ven({
    pattern: "vv",
    react: "👁️",
    desc: "Télécharger statut WhatsApp",
    category: "download",
    filename: __filename,
    use: "[répondre au message]"
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        if (!quoted) {
            return reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👁️ 𝗧𝗘𝗟𝗘𝗖𝗛𝗔𝗥𝗚𝗘𝗥 𝗩𝗩    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📝 Répondez au message     ┃
┃    contenant le statut VV  ┃
┃                           ┃
┃ 💡 Le statut sera sauvé    ┃
┃    et renvoyé             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim());
        }

        if (quoted.mtype === 'viewOnceMessageV2') {
            const media = quoted.message?.viewOnceMessageV2?.message;

            if (media?.imageMessage) {
                const buffer = await conn.downloadMediaMessage(quoted);
                await conn.sendMessage(from, {
                    image: buffer,
                    caption: `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🖼️ 𝗦𝗧𝗔𝗧𝗨𝗧 𝗜𝗠𝗔𝗚𝗘      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ✅ Statut sauvegardé       ┃
┃ 📤 Téléchargé avec succès  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                    `.trim()
                }, { quoted: mek });
            } else if (media?.videoMessage) {
                const buffer = await conn.downloadMediaMessage(quoted);
                await conn.sendMessage(from, {
                    video: buffer,
                    caption: `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎬 𝗦𝗧𝗔𝗧𝗨𝗧 𝗩𝗜𝗗𝗘𝗢      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ✅ Statut sauvegardé       ┃
┃ 📤 Téléchargé avec succès  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                    `.trim()
                }, { quoted: mek });
            }
        } else {
            reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❌ 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗜𝗡𝗩𝗔𝗟𝗜𝗗𝗘 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔍 Ce n'est pas un statut  ┃
┃    à visionnage unique     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim());
        }
    } catch (error) {
        console.error('Erreur VV:', error);
        reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 𝗩𝗩          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔄 Échec du téléchargement ┃
┃ 💡 Réessayez               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `.trim());
    }
});

// Téléchargement de musique
ven({
    pattern: "song",
    react: "🎵",
    desc: "Télécharger une chanson",
    category: "download",
    filename: __filename,
    use: "[nom de la chanson]"
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎵 𝗧𝗘𝗟𝗘𝗖𝗛𝗔𝗥𝗚𝗘𝗥 𝗠𝗨𝗦𝗜𝗤𝗨𝗘 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📝 Tapez le nom de la      ┃
┃    chanson à télécharger   ┃
┃                           ┃
┃ 💡 Exemple:               ┃
┃ .song Imagine Dragons     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim());
        }

        const query = args.join(' ');
        reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🔍 𝗥𝗘𝗖𝗛𝗘𝗥𝗖𝗛𝗘 𝗠𝗨𝗦𝗜𝗤𝗨𝗘  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🎵 Recherche: ${query.substring(0, 20)}${query.length > 20 ? '...' : ''}
┃ ⏳ Veuillez patienter...   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `.trim());

        // Utilisation d'une API fiable pour YouTube
        const searchResponse = await axios.get(`https://api.bk9.fun/ai/ytdl`, {
            params: { url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` }
        });

        if (searchResponse.data && searchResponse.data.audio) {
            const audioUrl = searchResponse.data.audio;
            const title = searchResponse.data.title || query;

            await conn.sendMessage(from, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        body: `🎵 ${config.BOT_NAME} Music`,
                        thumbnailUrl: searchResponse.data.thumbnail || config.MENU_IMAGE_URL,
                        sourceUrl: audioUrl,
                        mediaType: 2,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
        } else {
            throw new Error('Chanson non trouvée');
        }
    } catch (error) {
        console.error('Erreur Song:', error);
        reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 𝗠𝗨𝗦𝗜𝗤𝗨𝗘   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔍 Chanson introuvable     ┃
┃ 💡 Vérifiez l'orthographe  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `.trim());
    }
});