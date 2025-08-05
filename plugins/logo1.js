const {
  cmd,
  commands
} = require('../command');
const axios = require("axios");

const _0x1a0cd5 = {
  pattern: "logo1",
  desc: "image.",
  react: '🌌',
  category: "logo",
  use: ".logo1",
  filename: __filename
};
cmd(_0x1a0cd5, async (_0x500327, _0x56d921, _0x38f95e, {
  from: _0x30939a,
  mnu: _0x2710cf,
  quoted: _0x19c24d,
  body: _0x592844,
  isCmd: _0x3c9a8b,
  command: _0x361d46,
  args: _0x50a48c,
  q: _0x4ef5c5,
  isGroup: _0xaee9a8,
  sender: _0x3fd209,
  senderNumber: _0x4a99fa,
  botNumber2: _0x11b842,
  botNumber: _0x54b8f4,
  pushname: _0xb9dd62,
  isMe: _0x37d7bd,
  isOwner: _0x188a48,
  groupMetadata: _0x5ab4dd,
  groupName: _0x12aa13,
  participants: _0x45d8fc,
  groupAdmins: _0x35d795,
  isBotAdmins: _0x26cdc1,
  isAdmins: _0x244e05,
  reply: _0x1d9fe9
}) => {
  try {
    if (!_0x4ef5c5) {
      return _0x1d9fe9("Please Provide A Name");
    }
    const _0x360a34 = {
      quoted: _0x56d921
    };
    await _0x500327.sendMessage(_0x30939a, {
      'image': {
        'url': "https://dummyimage.com/600x400/&text=" + _0x4ef5c5
      },
      'caption': "© Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ ᴄᴀsᴇʏʀʜᴏᴅᴇs xᴍᴅ"
    }, _0x360a34);
  } catch (_0x49df19) {
    console.log(_0x49df19);
    _0x1d9fe9('' + _0x49df19);
  }
});
const _0x4b62e9 = {
  pattern: "logo2",
  desc: "image.",
  react: '🌌',
  category: "logo",
  use: ".logo2",
  filename: __filename
};
cmd(_0x4b62e9, async (_0x557a42, _0x518f8a, _0x27d789, {
  from: _0x144a8c,
  mnu: _0x3d2197,
  quoted: _0xa2808f,
  body: _0x468ebe,
  isCmd: _0x547385,
  command: _0x57c27c,
  args: _0x55fe24,
  q: _0x36c0fb,
  isGroup: _0x5a62f8,
  sender: _0x17bcf3,
  senderNumber: _0x3d9add,
  botNumber2: _0x5ae153,
  botNumber: _0x504d37,
  pushname: _0x47353a,
  isMe: _0x5236b9,
  isOwner: _0x30f7a8,
  groupMetadata: _0x5d4ef2,
  groupName: _0x3fd9e9,
  participants: _0x5a8c7c,
  groupAdmins: _0x385eac,
  isBotAdmins: _0x50c97b,
  isAdmins: _0x58b5e0,
  reply: _0x1e2aef
}) => {
  try {
    if (!_0x36c0fb) {
      return _0x1e2aef("Please Provide A Name");
    }
    const _0x4aa005 = {
      quoted: _0x518f8a
    };
    await _0x557a42.sendMessage(_0x144a8c, {
      'image': {
        'url': "https://www.flamingtext.com/net-fu/proxy_form.cgi?&script=fluffy-logo&text=" + _0x36c0fb
      },
      'caption': "> © Gᴇɴᴇʀᴀᴛᴇᴅ Bʏ ᴄᴀsᴇʏʀʜᴏᴅᴇs xᴍᴅ"
    }, _0x4aa005);
  } catch (_0x25715f) {
    console.log(_0x25715f);
    _0x1e2aef('' + _0x25715f);
  }
});
