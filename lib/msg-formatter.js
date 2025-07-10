const config = require('../settings');

// Fonction simple pour créer des messages avec bordure gauche uniquement
const createBox = (content, title = null) => {
    let result = '';

    if (title) {
        result += `│ ${title}\n`;
        result += `│ ──────────────────────\n`;
    }

    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.trim()) {
            result += `│ ${line}\n`;
        }
    });

    return result.trim();
};

// Fonction pour créer des messages de succès
const successBox = (message, title = '✅ SUCCÈS') => {
    return createBox(message, title);
};

// Fonction pour créer des messages d'erreur
const errorBox = (message, title = '❌ ERREUR') => {
    return createBox(message, title);
};

// Fonction pour créer des messages d'info
const infoBox = (message, title = 'ℹ️ INFO') => {
    return createBox(message, title);
};

// Fonction pour créer des messages de warning
const warningBox = (message, title = '⚠️ ATTENTION') => {
    return createBox(message, title);
};

// Fonction pour créer des listes avec bordure gauche
const createList = (items, title = null, emoji = '•') => {
    let content = '';
    items.forEach(item => {
        content += `${emoji} ${item}\n`;
    });
    return createBox(content.trim(), title);
};

// Fonction pour créer des statistiques avec bordure gauche
const createStats = (stats, title = '📊 STATISTIQUES') => {
    let content = '';
    Object.entries(stats).forEach(([key, value]) => {
        content += `${key}: ${value}\n`;
    });
    return createBox(content.trim(), title);
};

// Fonction pour créer des boutons avec bordure gauche
const createButtons = (buttons, title = '⚡ ACTIONS RAPIDES') => {
    let content = '';
    buttons.forEach(button => {
        content += `🔹 ${button}\n`;
    });
    return createBox(content.trim(), title);
};

// Fonction pour créer des messages de loading
const loadingBox = (message = 'Chargement en cours...') => {
    return createBox(`⏳ ${message}`, '🔄 TRAITEMENT');
};

// Fonction pour créer des messages de footer
const createFooter = () => {
    return createBox(
        `© ${config.BOT_NAME} - ${new Date().getFullYear()}\n` +
        `Powered by hhhisoka`,
        null
    );
};

module.exports = {
    createBox,
    successBox,
    errorBox,
    infoBox,
    warningBox,
    createList,
    createStats,
    createButtons,
    loadingBox,
    createFooter
};