
const { ven } = require('../hisoka');
const config = require('../settings');
const axios = require('axios');

ven({
    pattern: "ai",
    react: "🤖",
    alias: ["gpt", "chatgpt", "openai"],
    desc: "Chat avec l'intelligence artificielle",
    category: "ai",
    filename: __filename,
    use: "[question]"
}, async (conn, mek, m, { from, args, reply, pushname }) => {
    try {
        if (!args[0]) {
            return reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 𝗖𝗛𝗔𝗧 𝗔𝗩𝗘𝗖 𝗔𝗜        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💬 Posez votre question !   ┃
┃                            ┃
┃ 📝 Exemple:                ┃
┃ • .ai Comment ça va ?      ┃
┃ • .ai Écris un poème       ┃
┃ • .ai Aide-moi en math     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim());
        }

        const question = args.join(' ');
        
        // Utilisation d'une API fiable
        const response = await axios.get(`https://api.bk9.fun/ai/gemini`, {
            params: { q: question }
        });

        if (response.data && response.data.BK9) {
            const aiResponse = response.data.BK9;
            
            const formattedResponse = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 𝗥𝗘𝗣𝗢𝗡𝗦𝗘 𝗔𝗜          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 Question: ${question.substring(0, 20)}${question.length > 20 ? '...' : ''}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${aiResponse}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🔄 Nouvelle question ?      ┃
┃ Tapez: .ai [votre question] ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim();

            await conn.sendMessage(from, {
                text: formattedResponse,
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
            throw new Error('Réponse API invalide');
        }
    } catch (error) {
        console.error('Erreur AI:', error);
        reply(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 𝗔𝗜          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔄 Service temporairement   ┃
┃    indisponible            ┃
┃                           ┃
┃ 💡 Réessayez plus tard     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `.trim());
    }
});
