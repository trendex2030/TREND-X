const { cmd } = require("../command");
const config = require("../config");

const recentCallers = new Set();

// Anti-call event handler
cmd({ on: "body" }, async (client, message, chat, { from: sender }) => {
  try {
    client.ev.on("call", async (callData) => {
      if (!config.ANTI_CALL) return;

      for (const call of callData) {
        if (call.status === 'offer' && !call.isGroup) {
          await client.rejectCall(call.id, call.from);
          
          if (!recentCallers.has(call.from)) {
            recentCallers.add(call.from);
            
            await client.sendMessage(call.from, {
              text: "```Hii this is TREND-X a Personal Assistant!! Sorry for now, we cannot receive calls, whether in a group or personal if you need help or request features please chat owner``` ⚠️",
              mentions: [call.from]
            });
            
            setTimeout(() => recentCallers.delete(call.from), 600000);
          }
        }
      }
    });
  } catch (error) {
    console.error("Call rejection error:", error);
    await client.sendMessage(sender, { text: "⚠️ Error: " + error.message }, { quoted: chat });
  }
});

// Anti-call command with combined image+newsletter response
cmd({
    pattern: "anticall",
    alias: ["callblock", "togglecall"],
    desc: "Toggle call blocking feature",
    category: "owner",
    react: "📞",
    filename: __filename,
    fromMe: true
},
async (client, message, m, { isOwner, from, sender, args, prefix }) => {
    try {
        if (!isOwner) {
            return client.sendMessage(from, { 
                text: "🚫 Owner-only command",
                mentions: [sender]
            }, { quoted: message });
        }

        const action = args[0]?.toLowerCase() || 'status';
        let statusText, reaction = "📞", additionalInfo = "";

        switch (action) {
            case 'on':
                if (config.ANTI_CALL) {
                    statusText = "Anti-call is already *enabled*✅";
                    reaction = "ℹ️";
                } else {
                    config.ANTI_CALL = true;
                    statusText = "Anti-call has been *enabled*!";
                    reaction = "✅";
                    additionalInfo = "Calls will be automatically rejected🔇";
                }
                break;
                
            case 'off':
                if (!config.ANTI_CALL) {
                    statusText = "Anti-call is already *disabled*📳!";
                    reaction = "ℹ️";
                } else {
                    config.ANTI_CALL = false;
                    statusText = "Anti-call has been *disabled📛*!";
                    reaction = "❌";
                    additionalInfo = "Calls will be accepted";
                }
                break;
                
            default:
                statusText = `Anti-call Status: ${config.ANTI_CALL ? "✅ *ENABLED*" : "❌ *DISABLED*"}`;
                additionalInfo = config.ANTI_CALL ? "Calls are being blocked" : "Calls are allowed";
                break;
        }

        // Send the combined message with image and newsletter info
        await client.sendMessage(from, {
            image: { url: "https://files.catbox.moe/adymbp.jpg" },
            caption: `${statusText}\n\n${additionalInfo}\n\n_CASEYRHODES-TECH_`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401765045963@newsletter',
                    newsletterName: 'TREND 𝐓𝐄𝐂𝐇 🌟',
                    serverMessageId: 143
                }
            }
        }, { quoted: message });

        // Add reaction to original message
        await client.sendMessage(from, {
            react: { text: reaction, key: message.key }
        });

    } catch (error) {
        console.error("Anti-call command error:", error);
        await client.sendMessage(from, {
            text: `⚠️ Error: ${error.message}`,
            mentions: [sender]
        }, { quoted: message });
    }
});
