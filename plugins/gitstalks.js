const {
  cmd,
  commands
} = require("../command");
const {
  fetchJson
} = require('../lib/functions');
cmd({
  'pattern': "pair",
  'alias': ["getpair", "clone"],
  'react': '🔄',
  'desc': "pair",
  'category': "download",
  'use': ".pair +2546220530XXX",
  'filename': __filename
}, async (_0x27b138, _0x1e9ff3, _0x194381, {
  from: _0x377e1b,
  prefix: _0x583603,
  quoted: _0x5380b3,
  q: _0x11a944,
  reply: _0x1bfaac,
  isGroup: _0x15e1e6
}) => {
  try {
    if (_0x15e1e6) {
      return await _0x1bfaac("❌ This command is not allowed in group chats. Please use it in my inbox.");
    }
    if (!_0x11a944) {
      return await _0x1bfaac("*Example - :* .pair +2546220530XXX");
    }
    await _0x1bfaac("*Getting pairing code...*");
    const _0x45d8b5 = await fetchJson("https://six391-wkgc.onrender.com?number=" + _0x11a944);
    const _0x5278db = _0x45d8b5.code;
    await _0x194381.reply('' + _0x5278db);
    await _0x194381.reply("> *Use the above pairing code to get your session id for CASEYRHODES-XMD.*");
  } catch (_0x176bc8) {
    console.error(_0x176bc8);
    _0x1bfaac("An error occurred: " + _0x176bc8.message);
  }
});
cmd({
  'pattern': "pair2",
  'alias': ['getpair2', "clone2"],
  'react': '🔄',
  'desc': "pair",
  'category': 'download',
  'use': ".pair +2546220530XXX",
  'filename': __filename
}, async (_0x20b792, _0x1ceca7, _0x1c0675, {
  from: _0x222647,
  prefix: _0x57f1be,
  quoted: _0x4a0620,
  q: _0x21983e,
  reply: _0x4f82db,
  isGroup: _0x5dd7c8
}) => {
  try {
    if (_0x5dd7c8) {
      return await _0x4f82db("❌ This command is not allowed in group chats. Please use it in my inbox.");
    }
    if (!_0x21983e) {
      return await _0x4f82db("*Example - :* .pair2 +2546220530XXX");
    }
    await _0x4f82db("*Getting pairing code...*");
    const _0x509bbb = await fetchJson('https://ttpair.onrender.com/code?number=' + _0x21983e);
    const _0x141fd6 = _0x509bbb.code;
    await _0x1c0675.reply('' + _0x141fd6);
    await _0x1c0675.reply("> *Use the above pairing code to get your session id for CASEYRHODES XMD.*");
  } catch (_0x4a59d9) {
    console.error(_0x4a59d9);
    _0x4f82db("An error occurred: " + _0x4a59d9.message);
  }
});
