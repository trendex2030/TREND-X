

const {
  sleep
} = require("../lib/functions");
const {
  cmd,
  commands
} = require("../command");
cmd({
  'pattern': "rcolor",
  'react': "🎨",
  'alias':"randomcolour",
  'desc': "Generate a random color with name and code.",
  'category': "utility",
  'filename': __filename
}, async (_0xdb9b4f, _0x1dc91a, _0x232196, {
  reply: _0x82e9b2
}) => {
  try {
    const _0xb13dc7 = ["Red", 'Green', "Blue", "Yellow", 'Orange', 'Purple', 'Pink', 'Brown', 'Black', "White", "Gray", "Cyan", "Magenta", 'Violet', "Indigo", "Teal", 'Lavender', "Turquoise"];
    const _0x256030 = '#' + Math.floor(Math.random() * 0xffffff).toString(0x10);
    const _0x5d0cef = _0xb13dc7[Math.floor(Math.random() * _0xb13dc7.length)];
    _0x82e9b2("🎨 *\`ALI MD RANDOM COLOUR:\`* \n\nColour Name: " + _0x5d0cef + "\nCode: " + _0x256030);
  } catch (_0x563257) {
    console.error("Error in .randomcolor command:", _0x563257);
    _0x82e9b2("❌ An error occurred while generating the random color.");
  }
});
cmd({
  'pattern': "binary",
  'react': "🤹‍♂️",
  'desc': "Convert text into binary format.",
  'category': 'utility',
  'filename': __filename
}, async (_0x3249b3, _0x7a9df9, _0x3dccce, {
  args: _0x1d50f3,
  reply: _0x20adfd
}) => {
  try {
    if (!_0x1d50f3.length) {
      return _0x20adfd("❌ Please provide the text to convert to binary.");
    }
    const _0x12ab54 = _0x1d50f3.join(" ");
    const _0x63c851 = _0x12ab54.split('').map(_0x41ab34 => {
      return ("00000000" + _0x41ab34.charCodeAt(0x0).toString(0x2)).slice(-0x8);
    }).join(" ");
    _0x20adfd(" *\`Ali Binary Representation:\`* \n\n" + _0x63c851);
  } catch (_0x307dbc) {
    console.error("Error in .binary command:", _0x307dbc);
    _0x20adfd("❌ An error occurred while converting to binary.");
  }
});
cmd({
  'pattern': "dbinary",
  'react': "🧩",
  'desc': "Decode binary string into text.",
  'category': "utility",
  'filename': __filename
}, async (_0x5ef941, _0x158713, _0x4b75b0, {
  args: _0x359424,
  reply: _0x1fc9a9
}) => {
  try {
    if (!_0x359424.length) {
      return _0x1fc9a9("❌ Please provide the binary string to decode.");
    }
    const _0x1e16b2 = _0x359424.join(" ");
    const _0x26dbbd = _0x1e16b2.split(" ").map(_0x1bbd2b => {
      return String.fromCharCode(parseInt(_0x1bbd2b, 0x2));
    }).join('');
    _0x1fc9a9("*\`Kerm Decoded Text:\`* \n\n" + _0x26dbbd);
  } catch (_0xbe47d3) {
    console.error("Error in .binarydecode command:", _0xbe47d3);
    _0x1fc9a9("❌ An error occurred while decoding the binary string.");
  }
});
cmd({
  'pattern': "encode",
  'react': "🧩",
  'desc': "Encode text into Base64 format.",
  'category': "utility",
  'filename': __filename
}, async (_0x4adb24, _0x673c52, _0x53b711, {
  args: _0xc44ee1,
  reply: _0x451688
}) => {
  try {
    if (!_0xc44ee1.length) {
      return _0x451688("❌ Please provide the text to encode into Base64.");
    }
    const _0x3ffe51 = _0xc44ee1.join(" ");
    const _0x3a1e80 = Buffer.from(_0x3ffe51).toString("base64");
    _0x451688(" *\`Encoded Base64 Text:\`* \n\n" + _0x3a1e80);
  } catch (_0x2abb38) {
    console.error("Error in .encode command:", _0x2abb38);
    _0x451688("❌ An error occurred while encoding the text into Base64.");
  }
});
cmd({
  'pattern': 'decode',
  'react': "🤹‍♂️",
  'desc': "Decode Base64 encoded text.",
  'category': "utility",
  'filename': __filename
}, async (_0x1089b2, _0x9b388b, _0x101929, {
  args: _0x4fb23d,
  reply: _0xe552ef
}) => {
  try {
    if (!_0x4fb23d.length) {
      return _0xe552ef("❌ Please provide the Base64 encoded text to decode.");
    }
    const _0x5c819 = _0x4fb23d.join(" ");
    const _0x529359 = Buffer.from(_0x5c819, "base64").toString("utf-8");
    _0xe552ef("*\`Kerm Decoded Text:\`* \n\n" + _0x529359);
  } catch (_0x28b6de) {
    console.error("Error in .decode command:", _0x28b6de);
    _0xe552ef("❌ An error occurred while decoding the Base64 text.");
  }
});
cmd({
  'pattern': "urlencode",
  'desc': "Encode text into URL encoding.",
  'category': 'utility',
  'filename': __filename
}, async (_0x1b66a1, _0x5ea663, _0x4703fd, {
  args: _0x26d2aa,
  reply: _0x12589d
}) => {
  try {
    if (!_0x26d2aa.length) {
      return _0x12589d("❌ Please provide the text to encode into URL encoding.");
    }
    const _0x2ed7cc = _0x26d2aa.join(" ");
    const _0x35903e = encodeURIComponent(_0x2ed7cc);
    _0x12589d(" *Encoded URL Text:* \n" + _0x35903e);
  } catch (_0x380f20) {
    console.error("Error in .urlencode command:", _0x380f20);
    _0x12589d("❌ An error occurred while encoding the text.");
  }
});
cmd({
  'pattern': 'urldecode',
  'desc': "Decode URL encoded text.",
  'category': "utility",
  'filename': __filename
}, async (_0xebbefb, _0x141da6, _0x30d208, {
  args: _0x297082,
  reply: _0x585056
}) => {
  try {
    if (!_0x297082.length) {
      return _0x585056("❌ Please provide the URL encoded text to decode.");
    }
    const _0x17faba = _0x297082.join(" ");
    const _0x23cd98 = decodeURIComponent(_0x17faba);
    _0x585056("🔓 *Decoded Text:* \n" + _0x23cd98);
  } catch (_0x49aa11) {
    console.error("Error in .urldecode command:", _0x49aa11);
    _0x585056("❌ An error occurred while decoding the URL encoded text.");
  }
});
cmd({
  'pattern': "roll",
  'desc': "Roll a dice (1-6).",
  'category': 'fun',
  'filename': __filename
}, async (_0x52291b, _0x3b2718, _0x263aad, {
  reply: _0x2f786c
}) => {
  try {
    const _0xc66607 = Math.floor(Math.random() * 0x6) + 0x1;
    _0x2f786c("🎲 You rolled: *" + _0xc66607 + '*');
  } catch (_0xfc9684) {
    console.error("Error in .roll command:", _0xfc9684);
    _0x2f786c("❌ An error occurred while rolling the dice.");
  }
});
cmd({
  'pattern': "coinflip",
  'desc': "Flip a coin and get Heads or Tails.",
  'category': "fun",
  'filename': __filename
}, async (_0x43388c, _0x1f1a6d, _0x11ed37, {
  reply: _0x3ce285
}) => {
  try {
    const _0x264649 = Math.random() < 0.5 ? "Heads" : "Tails";
    _0x3ce285("🪙 Coin Flip Result: *" + _0x264649 + '*');
  } catch (_0x233808) {
    console.error("Error in .coinflip command:", _0x233808);
    _0x3ce285("❌ An error occurred while flipping the coin.");
  }
});
cmd({
  'pattern': "flip",
  'desc': "Flip the text you provide.",
  'category': 'fun',
  'filename': __filename
}, async (_0x2ce830, _0x36a68e, _0x89c2b5, {
  args: _0x4a0544,
  reply: _0x20d297
}) => {
  try {
    if (!_0x4a0544.length) {
      return _0x20d297("❌ Please provide the text to flip.");
    }
    const _0x8d1e25 = _0x4a0544.join(" ").split('').reverse().join('');
    _0x20d297("🔄 Flipped Text: *" + _0x8d1e25 + '*');
  } catch (_0x57be85) {
    console.error("Error in .flip command:", _0x57be85);
    _0x20d297("❌ An error occurred while flipping the text.");
  }
});
cmd({
  'pattern': "pick",
  'desc': "Pick between two choices.",
  'category': "fun",
  'filename': __filename
}, async (_0x3d4e6f, _0x59fa22, _0x231495, {
  args: _0x5915c6,
  reply: _0x92f526
}) => {
  try {
    if (_0x5915c6.length < 0x2) {
      return _0x92f526("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
    }
    const _0xb7816c = _0x5915c6.join(" ").split(',')[Math.floor(Math.random() * 0x2)].trim();
    _0x92f526("🎉 Bot picks: *" + _0xb7816c + '*');
  } catch (_0x5a875f) {
    console.error("Error in .pick command:", _0x5a875f);
    _0x92f526("❌ An error occurred while processing your request.");
  }
});
cmd({
  'pattern': "timenow",
  'desc': "Check the current local time.",
  'category': "utility",
  'filename': __filename
}, async (_0x9a07a0, _0x44fd28, _0x70d7c, {
  reply: _0x2cf87c
}) => {
  try {
    const _0x265dd6 = new Date();
    const _0x624003 = _0x265dd6.toLocaleTimeString("en-US", {
      'hour': '2-digit',
      'minute': "2-digit",
      'second': '2-digit',
      'hour12': true,
      'timeZone': "Asia/Pakistan"
    });
    _0x2cf87c("🕒 Current Local Time in Zimbabwe6: " + _0x624003);
  } catch (_0x39a156) {
    console.error("Error in .timenow command:", _0x39a156);
    _0x2cf87c("❌ An error occurred. Please try again later.");
  }
});
cmd({
  'pattern': 'date',
  'desc': "Check the current date.",
  'category': "utility",
  'filename': __filename
}, async (_0x33d0b2, _0x464ab3, _0xa1f520, {
  reply: _0x2f4fd4
}) => {
  try {
    const _0x11f490 = new Date();
    const _0x5987f3 = _0x11f490.toLocaleDateString('en-US', {
      'weekday': 'long',
      'year': "numeric",
      'month': 'long',
      'day': "numeric"
    });
    _0x2f4fd4("📅 Current Date: " + _0x5987f3);
  } catch (_0x2ed4a8) {
    console.error("Error in .date command:", _0x2ed4a8);
    _0x2f4fd4("❌ An error occurred. Please try again later.");
  }
});
cmd({
  'pattern': 'shapar',
  'desc': "Send shapar ASCII art with mentions.",
  'category': 'fun',
  'filename': __filename
}, async (_0x36fc22, _0x5e5045, _0x46ed7e, {
  from: _0x4a95e9,
  isGroup: _0x4545db,
  reply: _0x2c6281
}) => {
  try {
    if (!_0x4545db) {
      return _0x2c6281("This command can only be used in groups.");
    }
    const _0x11404d = _0x46ed7e.message.extendedTextMessage?.["contextInfo"]?.["mentionedJid"]?.[0x0];
    if (!_0x11404d) {
      return _0x2c6281("Please mention a user to send the ASCII art to.");
    }
    const _0x359ce7 = "😂 @" + _0x11404d.split('@')[0x0] + "!\n😂 that for you:\n\n" + "\n          _______\n       .-'       '-.\n      /           /|\n     /           / |\n    /___________/  |\n    |   _______ |  |\n    |  |  \\ \\  ||  |\n    |  |   \\ \\ ||  |\n    |  |____\\ \\||  |\n    |  '._  _.'||  |\n    |    .' '.  ||  |\n    |   '.___.' ||  |\n    |___________||  |\n    '------------'  |\n     \\_____________\\|\n";
    await _0x36fc22.sendMessage(_0x4a95e9, {
      'text': _0x359ce7,
      'mentions': [_0x11404d]
    }, {
      'quoted': _0x46ed7e
    });
  } catch (_0x57e7a8) {
    console.error("Error in .shapar command:", _0x57e7a8);
    _0x2c6281("An error occurred while processing the command. Please try again.");
  }
});
cmd({
  'pattern': "rate",
  'desc': "Rate someone out of 10.",
  'category': "fun",
  'filename': __filename
}, async (_0x54e566, _0x542197, _0x533c27, {
  from: _0x8dd0a,
  isGroup: _0x5485c0,
  reply: _0x4c482a
}) => {
  try {
    if (!_0x5485c0) {
      return _0x4c482a("This command can only be used in groups.");
    }
    const _0x206461 = _0x533c27.message.extendedTextMessage?.["contextInfo"]?.['mentionedJid']?.[0x0];
    if (!_0x206461) {
      return _0x4c482a("Please mention someone to rate.");
    }
    const _0x2ccf17 = Math.floor(Math.random() * 0xa) + 0x1;
    const _0x2febc0 = '@' + _0x206461.split('@')[0x0] + " is rated " + _0x2ccf17 + '/10.';
    await _0x54e566.sendMessage(_0x8dd0a, {
      'text': _0x2febc0,
      'mentions': [_0x206461]
    }, {
      'quoted': _0x533c27
    });
  } catch (_0xfc2d68) {
    console.error("Error in .rate command:", _0xfc2d68);
    _0x4c482a("An error occurred. Please try again.");
  }
});
cmd({
  'pattern': "countx",
  'desc': "Start a reverse countdown from the specified number to 1.",
  'category': 'owner',
  'filename': __filename
}, async (_0x463a1d, _0x2de13d, _0x574864, {
  args: _0x446409,
  reply: _0x467ce5,
  senderNumber: _0x296132
}) => {
  try {
    const _0x42aa6c = _0x463a1d.user.id.split(':')[0x0];
    if (_0x296132 !== _0x42aa6c) {
      return _0x467ce5("❎ Only the bot owner can use this command.");
    }
    if (!_0x446409[0x0]) {
      return _0x467ce5("✳️ Use this command like:\n *Example:* .countx 10");
    }
    const _0x597580 = parseInt(_0x446409[0x0].trim());
    if (isNaN(_0x597580) || _0x597580 <= 0x0 || _0x597580 > 0x32) {
      return _0x467ce5("❎ Please specify a valid number between 1 and 50.");
    }
    _0x467ce5("⏳ Starting reverse countdown from " + _0x597580 + "...");
    for (let _0x25839e = _0x597580; _0x25839e >= 0x1; _0x25839e--) {
      await _0x463a1d.sendMessage(_0x574864.chat, {
        'text': '' + _0x25839e
      }, {
        'quoted': _0x2de13d
      });
      await sleep(0x3e8);
    }
    _0x467ce5("✅ Countdown completed.");
  } catch (_0x1dc26f) {
    console.error(_0x1dc26f);
    _0x467ce5("❎ An error occurred while processing your request.");
  }
});
cmd({
  'pattern': "count",
  'desc': "Start a countdown from 1 to the specified number.",
  'category': 'owner',
  'filename': __filename
}, async (_0xd830cf, _0x801616, _0x37ccd0, {
  args: _0x21c31e,
  reply: _0x19288f,
  senderNumber: _0x2825a0
}) => {
  try {
    const _0x2c980a = _0xd830cf.user.id.split(':')[0x0];
    if (_0x2825a0 !== _0x2c980a) {
      return _0x19288f("❎ Only the bot owner can use this command.");
    }
    if (!_0x21c31e[0x0]) {
      return _0x19288f("✳️ Use this command like:\n *Example:* .count 10");
    }
    const _0xb11b58 = parseInt(_0x21c31e[0x0].trim());
    if (isNaN(_0xb11b58) || _0xb11b58 <= 0x0 || _0xb11b58 > 0x32) {
      return _0x19288f("❎ Please specify a valid number between 1 and 50.");
    }
    _0x19288f("⏳ Starting countdown to " + _0xb11b58 + "...");
    for (let _0x14e304 = 0x1; _0x14e304 <= _0xb11b58; _0x14e304++) {
      await _0xd830cf.sendMessage(_0x37ccd0.chat, {
        'text': '' + _0x14e304
      }, {
        'quoted': _0x801616
      });
      await sleep(0x3e8);
    }
    _0x19288f("✅ Countdown completed.");
  } catch (_0x48e78b) {
    console.error(_0x48e78b);
    _0x19288f("❎ An error occurred while processing your request.");
  }
});
cmd({
  'pattern': 'calculate',
  'alias': ['calc'],
  'desc': "Evaluate a mathematical expression.",
  'category': "utilities",
  'filename': __filename
}, async (_0x1cbb24, _0x5a22db, _0xb97cd9, {
  args: _0x62506a,
  reply: _0x552cd6
}) => {
  try {
    if (!_0x62506a[0x0]) {
      return _0x552cd6("✳️ Use this command like:\n *Example:* .calculate 5+3*2");
    }
    const _0x434def = _0x62506a.join(" ").trim();
    if (!/^[0-9+\-*/().\s]+$/.test(_0x434def)) {
      return _0x552cd6("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
    }
    let _0x4fe8b9;
    try {
      _0x4fe8b9 = eval(_0x434def);
    } catch (_0x500df3) {
      return _0x552cd6("❎ Error in calculation. Please check your expression.");
    }
    _0x552cd6("✅ Result of \"" + _0x434def + "\" is: " + _0x4fe8b9);
  } catch (_0x205272) {
    console.error(_0x205272);
    _0x552cd6("❎ An error occurred while processing your request.");
  }
});

let activeGames = {}; // Stocker les jeux en cours pour chaque groupe ou utilisateur

cmd({
  pattern: "numbergame",
  react: "🎲",
  desc: "Start a number guessing game.",
  category: "game",
  use: ".numbergame",
  filename: __filename,
}, async (conn, mek, m, { from, reply, isGroup, sender }) => {
  try {
    if (activeGames[from]) {
      return reply("❌ A game is already in progress! Use `.endgame` to stop it.");
    }

    // Générer un chiffre aléatoire entre 1 et 100
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    activeGames[from] = { targetNumber, attempts: {} };

    await reply("🎉 *Number Game Started!* 🎉\n\nI have chosen a number between 1 and 100.\nGuess the number by typing it in the chat!");
  } catch (e) {
    console.error(e);
    reply("❌ An error occurred while starting the game.");
  }
});

cmd({
  pattern: "guess",
  react: "🤔",
  desc: "Make a guess in the number game.",
  category: "game",
  use: ".guess <number>",
  filename: __filename,
}, async (conn, mek, m, { from, reply, q, sender }) => {
  try {
    const game = activeGames[from];
    if (!game) return reply("❌ No game is currently in progress. Start one with `.numbergame`.");

    const guessedNumber = parseInt(q);
    if (isNaN(guessedNumber)) return reply("❌ Please provide a valid number.");

    if (guessedNumber === game.targetNumber) {
      delete activeGames[from];
      return await reply(`🎉 *Congratulations!* 🎉\n\nThe correct number was *${guessedNumber}*.\nGame over!`);
    }

    if (!game.attempts[sender]) game.attempts[sender] = 0;
    game.attempts[sender]++;

    if (guessedNumber > game.targetNumber) {
      return reply("📉 *Too high!* Try again.");
    } else {
      return reply("📈 *Too low!* Try again.");
    }
  } catch (e) {
    console.error(e);
    reply("❌ An error occurred while processing your guess.");
  }
});

cmd({
  pattern: "endgame",
  react: "❌",
  desc: "End the current number game.",
  category: "game",
  use: ".endgame",
  filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
  try {
    if (!activeGames[from]) return reply("❌ No game is currently in progress.");

    delete activeGames[from];
    reply("❌ *Game ended.*");
  } catch (e) {
    console.error(e);
    reply("❌ An error occurred while ending the game.");
  }
});
