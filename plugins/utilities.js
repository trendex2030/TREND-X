
const { ven } = require('../trend');
const axios = require('axios');
const fs = require('fs');

const getContextInfo = () => {
    return {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363400575205721@newsletter',
            newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
            serverMessageId: 143,
        },
    };
};

// Plugin calculatrice
ven({
    pattern: "calc",
    desc: "Calculatrice simple",
    category: "other",
    react: "🧮",
    filename: __filename,
    use: "<calcul>"
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("Veuillez fournir un calcul.\nUtilisation : .calc 2+2");
        
        const calculation = args.join(" ");
        
        // Validation basique pour éviter l'injection de code
        if (!/^[0-9+\-*/.() ]+$/.test(calculation)) {
            return reply("Calcul invalide. Utilisez seulement des chiffres et les opérateurs +, -, *, /, ()");
        }
        
        try {
            const result = eval(calculation);
            
            const message = `
🧮 *Calculatrice*

📝 *Calcul:* ${calculation}
✅ *Résultat:* ${result}
            `.trim();

            await conn.sendMessage(mek.chat, {
                text: message,
                contextInfo: getContextInfo()
            }, { quoted: mek });

        } catch (error) {
            reply("Erreur dans le calcul. Vérifiez la syntaxe.");
        }

    } catch (error) {
        console.log(error);
        reply("Erreur lors du calcul.");
    }
});

// Plugin générateur de mots de passe
ven({
    pattern: "password",
    desc: "Génère un mot de passe sécurisé",
    category: "other",
    react: "🔐",
    filename: __filename,
    use: "<longueur>"
}, async (conn, mek, m, { args, reply }) => {
    try {
        const length = parseInt(args[0]) || 12;
        
        if (length < 6 || length > 50) {
            return reply("La longueur doit être entre 6 et 50 caractères.");
        }
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const message = `
🔐 *Générateur de mot de passe*

🔑 *Mot de passe:* \`${password}\`
📏 *Longueur:* ${length} caractères

⚠️ *Important:* Sauvegardez ce mot de passe en sécurité !
        `.trim();

        await conn.sendMessage(mek.chat, {
            text: message,
            contextInfo: getContextInfo()
        }, { quoted: mek });

    } catch (error) {
        console.log(error);
        reply("Erreur lors de la génération du mot de passe.");
    }
});

// Plugin raccourcisseur d'URL
ven({
    pattern: "short",
    desc: "Raccourcit une URL",
    category: "other",
    react: "🔗",
    filename: __filename,
    use: "<url>"
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("Veuillez fournir une URL.\nUtilisation : .short https://google.com");
        
        const url = args[0];
        
        if (!url.startsWith('http')) {
            return reply("Veuillez fournir une URL valide (commençant par http ou https).");
        }
        
        // Simulation d'un raccourcisseur d'URL
        const shortUrl = `https://short.ly/${Math.random().toString(36).substring(7)}`;
        
        const message = `
🔗 *Raccourcisseur d'URL*

📎 *URL originale:* ${url}
✂️ *URL raccourcie:* ${shortUrl}

⚠️ *Note:* Service de raccourcissement en développement
        `.trim();

        await conn.sendMessage(mek.chat, {
            text: message,
            contextInfo: getContextInfo()
        }, { quoted: mek });

    } catch (error) {
        console.log(error);
        reply("Erreur lors du raccourcissement de l'URL.");
    }
});

// Plugin convertisseur de devises
ven({
    pattern: "currency",
    desc: "Convertit des devises",
    category: "other",
    react: "💱",
    filename: __filename,
    use: "<montant> <de> <vers>"
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[2]) return reply("Veuillez fournir le montant et les devises.\nUtilisation : .currency 100 USD EUR");
        
        const amount = parseFloat(args[0]);
        const from = args[1].toUpperCase();
        const to = args[2].toUpperCase();
        
        if (isNaN(amount)) {
            return reply("Montant invalide.");
        }
        
        // Taux de change simulés
        const rates = {
            'USD': { 'EUR': 0.85, 'GBP': 0.75, 'JPY': 110, 'CAD': 1.25 },
            'EUR': { 'USD': 1.18, 'GBP': 0.88, 'JPY': 130, 'CAD': 1.47 },
            'GBP': { 'USD': 1.33, 'EUR': 1.14, 'JPY': 148, 'CAD': 1.67 }
        };
        
        const rate = rates[from]?.[to] || 1;
        const convertedAmount = (amount * rate).toFixed(2);
        
        const message = `
💱 *Convertisseur de devises*

💰 *Montant:* ${amount} ${from}
🔄 *Converti:* ${convertedAmount} ${to}
📊 *Taux:* 1 ${from} = ${rate} ${to}

⚠️ *Note:* Taux de change simulés
        `.trim();

        await conn.sendMessage(mek.chat, {
            text: message,
            contextInfo: getContextInfo()
        }, { quoted: mek });

    } catch (error) {
        console.log(error);
        reply("Erreur lors de la conversion.");
    }
});

// Plugin générateur de QR Code
ven({
    pattern: "qr",
    desc: "Génère un QR Code",
    category: "other",
    react: "📱",
    filename: __filename,
    use: "<texte>"
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("Veuillez fournir un texte.\nUtilisation : .qr Hello World");
        
        const text = args.join(" ");
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
        
        await conn.sendMessage(mek.chat, {
            image: { url: qrUrl },
            caption: `📱 *QR Code généré*\n\n📝 *Contenu:* ${text}`,
            contextInfo: getContextInfo()
        }, { quoted: mek });

    } catch (error) {
        console.log(error);
        reply("Erreur lors de la génération du QR Code.");
    }
});

// Plugin météo
ven({
    pattern: "weather",
    desc: "Affiche la météo d'une ville",
    category: "other",
    react: "🌤️",
    filename: __filename,
    use: "<ville>"
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("Veuillez fournir une ville.\nUtilisation : .weather Paris");
        
        const city = args.join(" ");
        
        // Données météo simulées
        const weatherData = {
            temperature: Math.floor(Math.random() * 30) + 5,
            condition: ['Ensoleillé', 'Nuageux', 'Pluvieux', 'Venteux'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 40) + 30,
            windSpeed: Math.floor(Math.random() * 20) + 5
        };
        
        const weatherEmojis = {
            'Ensoleillé': '☀️',
            'Nuageux': '☁️',
            'Pluvieux': '🌧️',
            'Venteux': '💨'
        };
        
        const message = `
🌤️ *Météo - ${city}*

🌡️ *Température:* ${weatherData.temperature}°C
${weatherEmojis[weatherData.condition]} *Condition:* ${weatherData.condition}
💧 *Humidité:* ${weatherData.humidity}%
💨 *Vent:* ${weatherData.windSpeed} km/h

⚠️ *Note:* Données météo simulées
        `.trim();

        await conn.sendMessage(mek.chat, {
            text: message,
            contextInfo: getContextInfo()
        }, { quoted: mek });

    } catch (error) {
        console.log(error);
        reply("Erreur lors de la récupération de la météo.");
    }
});

// Plugin horoscope
ven({
    pattern: "horoscope",
    desc: "Affiche l'horoscope du jour",
    category: "other",
    react: "🔮",
    filename: __filename,
    use: "<signe>"
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("Veuillez fournir un signe.\nUtilisation : .horoscope lion");
        
        const sign = args[0].toLowerCase();
        const signs = ['bélier', 'taureau', 'gémeaux', 'cancer', 'lion', 'vierge', 'balance', 'scorpion', 'sagittaire', 'capricorne', 'verseau', 'poissons'];
        
        if (!signs.includes(sign)) {
            return reply(`Signe invalide. Signes disponibles:\n${signs.join(', ')}`);
        }
        
        const predictions = [
            "Une journée pleine de surprises vous attend !",
            "Votre créativité sera au rendez-vous aujourd'hui.",
            "Les opportunités professionnelles se présenteront à vous.",
            "C'est le moment de prendre des décisions importantes.",
            "Votre charme naturel attirera l'attention."
        ];
        
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        
        const message = `
🔮 *Horoscope du jour*

♈ *Signe:* ${sign.charAt(0).toUpperCase() + sign.slice(1)}
📅 *Date:* ${new Date().toLocaleDateString()}

🌟 *Prédiction:* ${randomPrediction}

⚠️ *Note:* Horoscope généré aléatoirement
        `.trim();

        await conn.sendMessage(mek.chat, {
            text: message,
            contextInfo: getContextInfo()
        }, { quoted: mek });

    } catch (error) {
        console.log(error);
        reply("Erreur lors de la génération de l'horoscope.");
    }
});
