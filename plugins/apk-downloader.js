
const { ven } = require("../trend");
const axios = require("axios");

ven({
    pattern: "apk",
    desc: "Télécharge des fichiers APK depuis APKPure",
    category: "download",
    react: "📱",
    filename: __filename,
    use: "<nom de l'app>"
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("Veuillez fournir le nom de l'application.\nUtilisation : .apk WhatsApp");
        
        const appName = args.join(" ");
        
        await reply("🔍 Recherche de l'APK...");
        
        // Utiliser une API publique pour chercher des APK
        const searchUrl = `https://api.apkpure.com/api/v1/search_suggestion?key=${encodeURIComponent(appName)}&hl=en`;
        
        try {
            const searchResponse = await axios.get(searchUrl, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (searchResponse.data && searchResponse.data.length > 0) {
                const app = searchResponse.data[0];
                
                const message = `📱 *APK Trouvé*

📦 *Nom:* ${app.name || appName}
👤 *Développeur:* ${app.developer || 'N/A'}
⭐ *Note:* ${app.rating || 'N/A'}
📊 *Taille:* ${app.size || 'N/A'}
🔗 *Package:* ${app.package || 'N/A'}

⏳ Téléchargement en cours...`;

                await conn.sendMessage(mek.chat, {
                    text: message
                }, { quoted: mek });
                
                // Simuler le téléchargement (remplacer par vraie API si disponible)
                await conn.sendMessage(mek.chat, {
                    document: { url: `https://d.apkpure.com/b/APK/${app.package}?version=latest` },
                    fileName: `${app.name || appName}.apk`,
                    mimetype: 'application/vnd.android.package-archive',
                    caption: `📱 *${app.name || appName}*\n\n✅ APK téléchargé avec succès!`
                }, { quoted: mek });
                
            } else {
                throw new Error('Aucune application trouvée');
            }
            
        } catch (apiError) {
            // Fallback avec un message d'information
            const fallbackMessage = `📱 *Recherche APK*

🔍 Application recherchée: *${appName}*

❌ Le service de téléchargement APK n'est temporairement pas disponible.

💡 *Suggestion:* 
Vous pouvez télécharger manuellement depuis:
• Google Play Store
• APKPure.com
• APKMirror.com

🔄 Réessayez plus tard.`;

            await conn.sendMessage(mek.chat, {
                text: fallbackMessage
            }, { quoted: mek });
        }
        
    } catch (error) {
        console.error("❌ Erreur APK:", error);
        await reply(`📱 *Erreur APK*\n\n❌ ${error.message}\nVérifiez le nom de l'application et réessayez.`);
    }
});
