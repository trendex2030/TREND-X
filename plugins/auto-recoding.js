const fs = require('fs');
const path = require('path');
const config = require('../settings')
const {ven , commands} = require('../trend')

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363400575205721@newsletter',
            newsletterName: '𝗛𝗜𝗦𝗢𝗞𝗔-𝗠𝗗',
            serverMessageId: 143,
        },
    };
};


//auto recording
ven({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {       
 if (config.AUTO_RECORDING === 'true') {
                await conn.sendPresenceUpdate('recording', from);
            }
         } 
   );
