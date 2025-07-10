const { ven } = require("../hisoka");
const config = require('../settings');

ven({
  pattern: "compatibility",
  alias: ["friend", "fcheck"],
  desc: "Calcule le taux de compatibilité entre deux utilisateurs.",
  category: "fun",
  react: "💖",
  filename: __filename,
  use: "@tag1 @tag2",
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 2) {
      return reply("Veuillez mentionner deux utilisateurs pour calculer leur compatibilité.\nUtilisation : `.compatibility @user1 @user2`");
    }

    let user1 = m.mentionedJid[0]; 
    let user2 = m.mentionedJid[1]; 

    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    let compatibilityScore = Math.floor(Math.random() * 1000) + 1;

    if (user1 === specialNumber || user2 === specialNumber) {
      compatibilityScore = 1000;
      return reply(`💖 Compatibilité entre @${user1.split('@')[0]} et @${user2.split('@')[0]} : ${compatibilityScore}+/1000 💖`);
    }

    const contextInfo = {
      mentionedJid: [user1, user2, mek.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363400575205721@newsletter',
        newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
        serverMessageId: 143,
      },
    };

    await conn.sendMessage(mek.chat, {
      text: `💖 Compatibilité entre @${user1.split('@')[0]} et @${user2.split('@')[0]} : ${compatibilityScore}/1000 💖`,
      mentions: [user1, user2],
      contextInfo: contextInfo
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Erreur : ${error.message}`);
  }
});

ven({
  pattern: "aura",
  desc: "Calcule l'aura d'un utilisateur.",
  category: "fun",
  react: "💀",
  filename: __filename,
  use: "@tag",
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 1) {
      return reply("Veuillez mentionner un utilisateur pour calculer son aura.\nUtilisation : `.aura @user`");
    }

    let user = m.mentionedJid[0]; 
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    let auraScore = Math.floor(Math.random() * 1000) + 1;

    if (user === specialNumber) {
      auraScore = 999999;
      return reply(`💀 Aura de @${user.split('@')[0]} : ${auraScore}+ 🗿`);
    }

    const contextInfo = {
      mentionedJid: [user, mek.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363400575205721@newsletter',
        newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
        serverMessageId: 143,
      },
    };

    await conn.sendMessage(mek.chat, {
      text: `💀 Aura de @${user.split('@')[0]} : ${auraScore}/1000 🗿`,
      mentions: [user],
      contextInfo: contextInfo
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Erreur : ${error.message}`);
  }
});

ven({
  pattern: "roast",
  desc: "Chambre un utilisateur (pour s'amuser)",
  category: "fun",
  react: "🔥",
  filename: __filename,
  use: "@tag"
}, async (conn, mek, m, { q, reply }) => {
  let roasts = [
    // (Liste de blagues traduites si besoin)
    "Frérot, ton QI est plus bas que le signal WiFi d’un cyber !",
    "Tu réfléchis tellement qu'on dirait un agent de la NASA !",
    "Même Google ne trouve pas ton nom !",
    "Ton cerveau tourne sous 2G !",
    "Tu devrais avoir un panneau : « En construction éternelle » !",
    "Tu fais buguer la vie des autres juste en parlant.",
    "Tu es une mise à jour qui ne marche jamais.",
    "Tu es un bug ambulant, mais marrant quand même !",
    // ... etc.
  ];

  let randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
  let sender = `@${mek.sender.split("@")[0]}`;
  let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

  if (!mentionedUser) {
    return reply("Utilisation : .roast @utilisateur (Tague quelqu’un à chambrer!)");
  }

  let target = `@${mentionedUser.split("@")[0]}`;

  let message = `${target} :\n *${randomRoast}*\n> C’est juste pour rigoler, ne le prends pas mal !`;
  const contextInfo = {
    mentionedJid: [mek.sender, mentionedUser],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363400575205721@newsletter',
      newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
      serverMessageId: 143,
    },
  };

  await conn.sendMessage(mek.chat, { 
    text: message, 
    mentions: [mek.sender, mentionedUser],
    contextInfo: contextInfo
  }, { quoted: mek });
});

ven({
  pattern: "8ball",
  desc: "La boule magique répond à tes questions.",
  category: "fun",
  react: "🎱",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("Pose une question fermée ! Exemple : .8ball Vais-je devenir riche ?");

  let responses = [
    "Oui !", "Non.", "Peut-être...", "Certainement !", "Pas sûr.",
    "Repose la question plus tard.", "Je ne pense pas.", "Absolument !",
    "Aucune chance !", "Ça semble prometteur !"
  ];

  let answer = responses[Math.floor(Math.random() * responses.length)];

  const contextInfo = {
    mentionedJid: [mek.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363400575205721@newsletter',
      newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
      serverMessageId: 143,
    },
  };

  await conn.sendMessage(mek.chat, {
    text: `🎱 *La boule magique dit :* ${answer}`,
    contextInfo: contextInfo
  }, { quoted: mek });
});

ven({
  pattern: "compliment",
  desc: "Fais un compliment gentil",
  category: "fun",
  react: "😊",
  filename: __filename,
  use: "@tag (optionnel)"
}, async (conn, mek, m, { reply }) => {
  let compliments = [
    "Tu es incroyable tel que tu es ! 💖",
    "Tu illumines chaque pièce où tu entres ! 🌟",
    "Ton sourire est contagieux ! 😊",
    "Tu es un(e) vrai(e) génie à ta façon ! 🧠",
    "Ta gentillesse rend le monde meilleur ! ❤️",
    "Tu es comme un rayon de soleil humain ! ☀️",
    "Tu es unique et irremplaçable ! ✨",
    "Ton énergie est inspirante ! 💫",
    "Tu es plus fort(e) que tu ne le penses ! 💪",
    "Tu es une œuvre d'art vivante ! 🎨",
  ];

  let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
  let sender = `@${mek.sender.split("@")[0]}`;
  let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
  let target = mentionedUser ? `@${mentionedUser.split("@")[0]}` : "";

  let message = mentionedUser
    ? `${sender} a complimenté ${target} :\n😊 *${randomCompliment}*`
    : `${sender}, tu as oublié de taguer quelqu’un ! Mais voici un compliment pour toi :\n😊 *${randomCompliment}*`;

  const contextInfo = {
    mentionedJid: [mek.sender, mentionedUser].filter(Boolean),
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363400575205721@newsletter',
      newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
      serverMessageId: 143,
    },
  };

  await conn.sendMessage(mek.chat, { 
    text: message, 
    mentions: [mek.sender, mentionedUser].filter(Boolean),
    contextInfo: contextInfo
  }, { quoted: mek });
});

ven({
  pattern: "lovetest",
  desc: "Test de compatibilité amoureuse entre deux utilisateurs",
  category: "fun",
  react: "❤️",
  filename: __filename,
  use: "@tag1 @tag2"
}, async (conn, mek, m, { args, reply }) => {
  if (args.length < 2) return reply("Tague deux utilisateurs ! Exemple : .lovetest @user1 @user2");

  let user1 = args[0].replace("@", "") + "@s.whatsapp.net";
  let user2 = args[1].replace("@", "") + "@s.whatsapp.net";

  let lovePercent = Math.floor(Math.random() * 100) + 1;

  let messages = [
    { range: [90, 100], text: "💖 *Un couple fait pour durer !*" },
    { range: [75, 89], text: "😍 *Forte connexion !*" },
    { range: [50, 74], text: "😊 *Bonne compatibilité, ça peut marcher !*" },
    { range: [30, 49], text: "🤔 *C’est compliqué, mais pas impossible !*" },
    { range: [10, 29], text: "😅 *Pas top top... amis peut-être ?*" },
    { range: [1, 9], text: "💔 *Ouille... ça sent la rupture bollywoodienne !*" }
  ];

  let loveMessage = messages.find(msg => lovePercent >= msg.range[0] && lovePercent <= msg.range[1]).text;

  let message = `💘 *Test de compatibilité amoureuse* 💘\n\n❤️ *@${user1.split("@")[0]}* + *@${user2.split("@")[0]}* = *${lovePercent}%*\n${loveMessage}`;

  const contextInfo = {
    mentionedJid: [user1, user2, mek.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363400575205721@newsletter',
      newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
      serverMessageId: 143,
    },
  };

  await conn.sendMessage(mek.chat, { 
    text: message, 
    mentions: [user1, user2],
    contextInfo: contextInfo
  }, { quoted: mek });
});

ven({
  pattern: "emoji",
  desc: "Convertit un texte en forme emoji.",
  category: "fun",
  react: "🙂",
  filename: __filename,
  use: "<texte>"
}, async (conn, mek, m, { args, q, reply }) => {
  try {
    let text = args.join(" ");

    let emojiMapping = {
      "a": "🅰️", "b": "🅱️", "c": "🇨️", "d": "🇩️", "e": "🇪️", "f": "🇫️", "g": "🇬️",
      "h": "🇭️", "i": "🇮️", "j": "🇯️", "k": "🇰️", "l": "🇱️", "m": "🇲️", "n": "🇳️",
      "o": "🅾️", "p": "🇵️", "q": "🇶️", "r": "🇷️", "s": "🇸️", "t": "🇹️", "u": "🇺️",
      "v": "🇻️", "w": "🇼️", "x": "🇽️", "y": "🇾️", "z": "🇿️",
      "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣",
      "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣",
      " ": "␣",
    };

    let emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    if (!text) return reply("Veuillez fournir un texte à convertir en emoji !");

    const contextInfo = {
      mentionedJid: [mek.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363400575205721@newsletter',
        newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
        serverMessageId: 143,
      },
    };

    await conn.sendMessage(mek.chat, {
      text: emojiText,
      contextInfo: contextInfo
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`Erreur : ${error.message}`);
  }
});