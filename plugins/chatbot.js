const { ven } = require('../trend');
const { addUser, removeUser, isChatbotUser } = require('../settings);

ven({
  pattern: "chatbot",
  desc: "Enable or disable chatbot mode",
  category: "ai",
  use: "<on/off>",
  react: "🤖",
  filename: __filename
},
async (conn, mek, m, { q, reply, sender }) => {
  if (!q) return reply("🧠 Use `.chatbot on` or `.chatbot off`");

  const user = sender || m.sender;

  if (q.toLowerCase() === "on") {
    addUser(user);
    return reply("✅ Chatbot mode ON. I’ll now reply to your messages.");
  } else if (q.toLowerCase() === "off") {
    removeUser(user);
    return reply("❌ Chatbot mode OFF. I won’t reply automatically.");
  } else {
    return reply("⚠️ Invalid input. Use `.chatbot on` or `.chatbot off`");
  }
});
