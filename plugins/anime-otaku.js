const { ven } = require('../hisoka');
const config = require('../settings');
const axios = require('axios');

// Citations d'anime
ven({
    pattern: "animequote",
    react: "✨",
    alias: ["quote", "citation"],
    desc: "Obtenir une citation d'anime aléatoire",
    category: "anime",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Utilisation d'une API fiable pour les citations d'anime
        const response = await axios.get('https://api.quotable.io/quotes/random?tags=anime');

        if (response.data && response.data[0]) {
            const quote = response.data[0];

            const quoteMessage = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ✨ 𝗖𝗜𝗧𝗔𝗧𝗜𝗢𝗡 𝗔𝗡𝗜𝗠𝗘     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

💭 *"${quote.content}"*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 Auteur: ${quote.author}
┃ 📚 Longueur: ${quote.length} caractères
┃ 🏷️ Tags: ${quote.tags.join(', ')}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎊 *Inspiré par l'anime !*
            `.trim();

            await conn.sendMessage(from, {
                text: quoteMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400575205721@newsletter',
                        newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });
        } else {
            // Fallback avec citations prédéfinies
            const animeQuotes = [
                {
                    quote: "Il n'y a pas de raccourci vers n'importe quel endroit qui vaut la peine d'aller.",
                    author: "Spirited Away",
                    anime: "Le Voyage de Chihiro"
                },
                {
                    quote: "La vraie bataille commence maintenant !",
                    author: "Naruto Uzumaki",
                    anime: "Naruto"
                },
                {
                    quote: "Je ne perdrai jamais ! J'ai des amis qui croient en moi !",
                    author: "Natsu Dragneel",
                    anime: "Fairy Tail"
                },
                {
                    quote: "Un héros peut sauver le monde, mais il ne peut pas sauver son propre cœur.",
                    author: "Lelouch vi Britannia",
                    anime: "Code Geass"
                },
                {
                    quote: "Le pouvoir vient en réponse à un besoin, pas à un désir.",
                    author: "Goku",
                    anime: "Dragon Ball Z"
                }
            ];

            const randomQuote = animeQuotes[Math.floor(Math.random() * animeQuotes.length)];

            const quoteMessage = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ✨ 𝗖𝗜𝗧𝗔𝗧𝗜𝗢𝗡 𝗔𝗡𝗜𝗠𝗘     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

💭 *"${randomQuote.quote}"*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 Personnage: ${randomQuote.author}
┃ 📺 Anime: ${randomQuote.anime}
┃ 🌟 Citation inspirante
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎊 *Laissez-vous inspirer !*
            `.trim();

            await conn.sendMessage(from, {
                text: quoteMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400575205721@newsletter',
                        newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });
        }
    } catch (error) {
        console.error('Erreur AnimequOte:', error);
        reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 𝗖𝗜𝗧𝗔𝗧𝗜𝗢𝗡   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔄 Service temporairement   ┃
┃    indisponible            ┃
┃ 💡 Réessayez plus tard     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `.trim());
    }
});

// Recherche d'anime
ven({
    pattern: "anime",
    react: "🎌",
    desc: "Rechercher des informations sur un anime",
    category: "anime",
    filename: __filename,
    use: "[nom de l'anime]"
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎌 𝗥𝗘𝗖𝗛𝗘𝗥𝗖𝗛𝗘 𝗔𝗡𝗜𝗠𝗘    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📝 Tapez le nom de l'anime ┃
┃    à rechercher            ┃
┃                           ┃
┃ 💡 Exemple:               ┃
┃ .anime Naruto             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim());
        }

        const query = args.join(' ');

        // Utilisation d'une API fiable pour les informations d'anime
        const response = await axios.get(`https://api.jikan.moe/v4/anime`, {
            params: { q: query, limit: 1 }
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
            const anime = response.data.data[0];

            const animeInfo = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎌 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡𝗦 𝗔𝗡𝗜𝗠𝗘 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📺 **Titre:** ${anime.title}
🇯🇵 **Titre japonais:** ${anime.title_japanese || 'N/A'}
⭐ **Score:** ${anime.score || 'N/A'}/10
📅 **Année:** ${anime.year || 'N/A'}
🎬 **Épisodes:** ${anime.episodes || 'N/A'}
📊 **Statut:** ${anime.status || 'N/A'}
🎭 **Genres:** ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}

📝 **Synopsis:**
${anime.synopsis?.substring(0, 300) || 'Aucun synopsis disponible'}${anime.synopsis?.length > 300 ? '...' : ''}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🔗 Plus d'infos: ${anime.url}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim();

            await conn.sendMessage(from, {
                image: { url: anime.images.jpg.image_url },
                caption: animeInfo,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400575205721@newsletter',
                        newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });
        } else {
            reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❌ 𝗔𝗡𝗜𝗠𝗘 𝗜𝗡𝗧𝗥𝗢𝗨𝗩𝗔𝗕𝗟𝗘 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔍 Aucun résultat pour:    ┃
┃    "${query}"               ┃
┃                           ┃
┃ 💡 Vérifiez l'orthographe  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim());
        }
    } catch (error) {
        console.error('Erreur Anime:', error);
        reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 𝗔𝗡𝗜𝗠𝗘       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔄 Service temporairement   ┃
┃    indisponible            ┃
┃ 💡 Réessayez plus tard     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `.trim());
    }
});