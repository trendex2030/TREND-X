const axios = require('axios');
const { ven } = require('../trend'); // Adjust path as needed

ven({
  pattern: "chatbot",
  desc: "Ask anything to AI",
  category: "ai",
  use: "<text>",
  react: "🤖",
  filename: __filename
},
async (conn, mek, m, { q, reply, pushname }) => {
  if (!q) return reply("❌ Please enter a message for the chatbot.");

  try {
    const res = await axios.get(`https://api.safone.tech/chatgpt?message=${encodeURIComponent(q)}`);
    const response = res.data?.response || "🤖 I didn't understand that.";
    await conn.sendMessage(m.chat, { text: response }, { quoted: m });
  } catch (err) {
    console.error("API Error:", err);
    return reply("⚠️ Failed to contact the chatbot API.");
  }
});
