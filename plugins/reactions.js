const { ven } = require("../hisoka");
const axios = require("axios");
const config = require("../settings");

// Configuration des APIs pour les réactions
const reactionAPIs = {
    waifu: "https://api.waifu.pics/sfw/",
    nekos: "https://nekos.life/api/v2/img/",
    some: "https://api.somethingisrandom.com/v1/img/"
};

// Fonction pour obtenir un GIF de réaction
async function getReactionGif(reaction) {
    try {
        // Essayer d'abord l'API waifu.pics
        const waifuUrl = `${reactionAPIs.waifu}${reaction}`;
        const response = await axios.get(waifuUrl, { timeout: 10000 });

        if (response.data && response.data.url) {
            return response.data.url;
        }

        // Si waifu.pics échoue, essayer nekos.life
        const nekosUrl = `${reactionAPIs.nekos}${reaction}`;
        const nekosResponse = await axios.get(nekosUrl, { timeout: 10000 });

        if (nekosResponse.data && nekosResponse.data.url) {
            return nekosResponse.data.url;
        }

        throw new Error("Aucune API disponible");
    } catch (error) {
        console.error(`❌ Erreur API pour ${reaction}:`, error.message);
        throw error;
    }
}

// Fonction pour envoyer une réaction
async function sendReaction(conn, mek, m, reactionType, reactionEmoji, description) {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        // Messages personnalisés selon le type de réaction
        let message;
        if (mentionedUser) {
            let target = `@${mentionedUser.split("@")[0]}`;
            message = getReactionMessage(reactionType, sender, target, false);
        } else if (isGroup) {
            message = getReactionMessage(reactionType, sender, null, true);
        } else {
            message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ${reactionEmoji} ${description.toUpperCase()}
┃ ──────────────────────────────
┃ ${sender} ${getActionText(reactionType)}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;
        }

        // Obtenir le GIF depuis l'API
        const gifUrl = await getReactionGif(reactionType);

        // Envoyer le GIF directement
        await conn.sendMessage(
            mek.chat,
            {
                image: { url: gifUrl },
                caption: message,
                mentions: [mek.sender, mentionedUser].filter(Boolean)
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error(`❌ Erreur commande .${reactionType}:`, error);

        // Message d'erreur stylé
        const errorMsg = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔄 Impossible de charger   ┃
┃    la réaction ${reactionType}        ┃
┃ 💡 Réessayez plus tard     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `.trim();

        await conn.sendMessage(mek.chat, { text: errorMsg }, { quoted: mek });
    }
}

// Messages personnalisés pour chaque réaction
function getReactionMessage(reactionType, sender, target, isGroup) {
    const messages = {
        cry: {
            single: target ? `${sender} pleure sur ${target} 😢` : `${sender} pleure !`,
            group: `${sender} pleure devant tout le monde ! 😭`
        },
        hug: {
            single: target ? `${sender} fait un câlin à ${target} 🤗` : `${sender} veut des câlins !`,
            group: `${sender} fait des câlins à tout le monde ! 🫂`
        },
        kiss: {
            single: target ? `${sender} embrasse ${target} 💋` : `${sender} envoie des bisous !`,
            group: `${sender} embrasse tout le monde ! 😘`
        },
        slap: {
            single: target ? `${sender} gifle ${target} ✋` : `${sender} gifle dans le vide !`,
            group: `${sender} gifle tout le monde ! 💥`
        },
        pat: {
            single: target ? `${sender} caresse ${target} 🫂` : `${sender} se caresse la tête !`,
            group: `${sender} caresse tout le monde ! 🤲`
        },
        cuddle: {
            single: target ? `${sender} se blottit contre ${target} 🤗` : `${sender} veut des câlins !`,
            group: `${sender} se blottit contre tout le monde ! 🥰`
        },
        bully: {
            single: target ? `${sender} embête ${target} 😈` : `${sender} fait le méchant !`,
            group: `${sender} embête tout le monde ! 👿`
        },
        bonk: {
            single: target ? `${sender} tape ${target} avec un marteau 🔨` : `${sender} se tape la tête !`,
            group: `${sender} tape tout le monde ! 💥`
        },
        poke: {
            single: target ? `${sender} pique ${target} 👉` : `${sender} pique dans le vide !`,
            group: `${sender} pique tout le monde ! 👆`
        },
        wave: {
            single: target ? `${sender} salue ${target} 👋` : `${sender} salue !`,
            group: `${sender} salue tout le monde ! 🙋‍♂️`
        },
        smile: {
            single: target ? `${sender} sourit à ${target} 😊` : `${sender} sourit !`,
            group: `${sender} sourit à tout le monde ! 😄`
        },
        dance: {
            single: target ? `${sender} danse avec ${target} 💃` : `${sender} danse !`,
            group: `${sender} danse avec tout le monde ! 🕺`
        },
        happy: {
            single: target ? `${sender} est heureux avec ${target} 😊` : `${sender} est heureux !`,
            group: `${sender} est heureux avec tout le monde ! 🥳`
        }
    };

    const messageData = messages[reactionType] || {
        single: target ? `${sender} réagit à ${target}` : `${sender} réagit !`,
        group: `${sender} réagit avec tout le monde !`
    };

    return isGroup ? messageData.group : messageData.single;
}

function getActionText(reactionType) {
    const actions = {
        cry: "pleure",
        hug: "fait des câlins",
        kiss: "envoie des bisous",
        slap: "gifle",
        pat: "caresse",
        cuddle: "se blottit",
        bully: "embête",
        bonk: "tape avec un marteau",
        poke: "pique",
        wave: "salue",
        smile: "sourit",
        dance: "danse",
        happy: "est heureux"
    };

    return actions[reactionType] || "réagit";
}

// === COMMANDES DE RÉACTION ===

ven({
    pattern: "cry",
    desc: "Envoyer une réaction de pleurs avec GIF animé",
    category: "reaction",
    react: "😢",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "cry", "😢", "pleurs");
});

ven({
    pattern: "hug",
    desc: "Envoyer une réaction de câlin avec GIF animé",
    category: "reaction",
    react: "🤗",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "hug", "🤗", "câlin");
});

ven({
    pattern: "kiss",
    desc: "Envoyer une réaction de bisou avec GIF animé",
    category: "reaction",
    react: "💋",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "kiss", "💋", "bisou");
});

ven({
    pattern: "slap",
    desc: "Envoyer une réaction de gifle avec GIF animé",
    category: "reaction",
    react: "✋",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "slap", "✋", "gifle");
});

ven({
    pattern: "pat",
    desc: "Envoyer une réaction de caresse avec GIF animé",
    category: "reaction",
    react: "🫂",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "pat", "🫂", "caresse");
});

ven({
    pattern: "cuddle",
    desc: "Envoyer une réaction de câlin serré avec GIF animé",
    category: "reaction",
    react: "🤗",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "cuddle", "🤗", "câlin serré");
});

ven({
    pattern: "bully",
    desc: "Envoyer une réaction d'embêtement avec GIF animé",
    category: "reaction",
    react: "😈",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "bully", "😈", "embêtement");
});

ven({
    pattern: "bonk",
    desc: "Envoyer une réaction de tape avec GIF animé",
    category: "reaction",
    react: "🔨",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "bonk", "🔨", "tape");
});

ven({
    pattern: "poke",
    desc: "Envoyer une réaction de pique avec GIF animé",
    category: "reaction",
    react: "👉",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "poke", "👉", "pique");
});

ven({
    pattern: "wave",
    desc: "Envoyer une réaction de salut avec GIF animé",
    category: "reaction",
    react: "👋",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "wave", "👋", "salut");
});

ven({
    pattern: "smile",
    desc: "Envoyer une réaction de sourire avec GIF animé",
    category: "reaction",
    react: "😊",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "smile", "😊", "sourire");
});

ven({
    pattern: "dance",
    desc: "Envoyer une réaction de danse avec GIF animé",
    category: "reaction",
    react: "💃",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "dance", "💃", "danse");
});

ven({
    pattern: "happy",
    desc: "Envoyer une réaction de joie avec GIF animé",
    category: "reaction",
    react: "😊",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "happy", "😊", "joie");
});

ven({
    pattern: "awoo",
    desc: "Envoyer une réaction awoo avec GIF animé",
    category: "reaction",
    react: "🐺",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "awoo", "🐺", "awoo");
});

ven({
    pattern: "blush",
    desc: "Envoyer une réaction de rougissement avec GIF animé",
    category: "reaction",
    react: "😊",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "blush", "😊", "rougissement");
});

ven({
    pattern: "smug",
    desc: "Envoyer une réaction suffisante avec GIF animé",
    category: "reaction",
    react: "😏",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "smug", "😏", "suffisance");
});

ven({
    pattern: "nom",
    desc: "Envoyer une réaction de manger avec GIF animé",
    category: "reaction",
    react: "🍽️",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "nom", "🍽️", "manger");
});

ven({
    pattern: "wink",
    desc: "Envoyer une réaction de clin d'œil avec GIF animé",
    category: "reaction",
    react: "😉",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "wink", "😉", "clin d'œil");
});

ven({
    pattern: "bite",
    desc: "Envoyer une réaction de mordre avec GIF animé",
    category: "reaction",
    react: "🦷",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "bite", "🦷", "mordre");
});

ven({
    pattern: "lick",
    desc: "Envoyer une réaction de lécher avec GIF animé",
    category: "reaction",
    react: "👅",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "lick", "👅", "lécher");
});

ven({
    pattern: "yeet",
    desc: "Envoyer une réaction yeet avec GIF animé",
    category: "reaction",
    react: "💨",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "yeet", "💨", "yeet");
});

ven({
    pattern: "handhold",
    desc: "Envoyer une réaction de tenir la main avec GIF animé",
    category: "reaction",
    react: "🤝",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "handhold", "🤝", "tenir la main");
});

ven({
    pattern: "highfive",
    desc: "Envoyer une réaction de tape-là avec GIF animé",
    category: "reaction",
    react: "✋",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "highfive", "✋", "tape-là");
});

ven({
    pattern: "glomp",
    desc: "Envoyer une réaction de saut-câlin avec GIF animé",
    category: "reaction",
    react: "🤗",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "glomp", "🤗", "saut-câlin");
});

ven({
    pattern: "cringe",
    desc: "Envoyer une réaction de malaise avec GIF animé",
    category: "reaction",
    react: "😬",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "cringe", "😬", "malaise");
});

ven({
    pattern: "kill",
    desc: "Envoyer une réaction de tuer avec GIF animé",
    category: "reaction",
    react: "🔪",
    filename: __filename,
    use: "@tag (optionnel)",
}, async (conn, mek, m) => {
    await sendReaction(conn, mek, m, "kill", "🔪", "tuer");
});