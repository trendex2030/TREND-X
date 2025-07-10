const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const config = require('../settings');
const { ven } = require('../hisoka');

ven({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch information about this GitHub repository.",
    react: "📂",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/hhhisoka/Wa-his-v1.0';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

        const data = await res.json();

        const caption = `
╭━━⬣ 🔍 *GitHub Repository Info*
┃
┃ 📦 *Nom du Projet:* ${data.name}
┃ 👑 *Auteur:* ${data.owner.login}
┃ ⭐ *Étoiles:* ${data.stargazers_count}
┃ 🍴 *Forks:* ${data.forks_count}
┃ 🌐 *URL:* ${data.html_url}
┃ 📝 *Description:* ${data.description || 'Aucune description disponible.'}
┃
╰━━━━━━━⬣
✨ *Merci de ⭐ le repo si tu aimes !*
🔧 ${config.DESCRIPTION}
`.trim();

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363400575205721@newsletter',
                newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
                serverMessageId: 143
            }
        };

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption,
            contextInfo
        }, { quoted: mek });

    
    } catch (error) {
        console.error("Repo Command Error:", error);
        reply("❌ *Failed to fetch repository info.*\nPlease try again later.");
    }
});
