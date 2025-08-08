const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

// YouTube video downloader command
cmd({
  'pattern': 'video78',
  'react': '🎬',
  'desc': "Download video from YouTube by searching for keywords.",
  'category': "media",
  'use': ".video <keywords>",
  'filename': __filename
}, async (message, client, args, { from, args: queryArgs, reply }) => {
  try {
    const searchQuery = queryArgs.join(" ");
    
    // Validate input
    if (!searchQuery.trim()) {
      return reply("*Please provide a video title or keywords to search for.*");
    }

    reply("*_🎬 Searching for video, please wait..._*");

    // Search YouTube
    const searchResults = await yts(searchQuery);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return reply(`❌ No results found for "${searchQuery}".`);
    }

    const firstVideo = searchResults.videos[0];
    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp4?url=${firstVideo.url}`;

    // Fetch video data
    const response = await axios.get(apiUrl);
    if (!response.data.success) {
      return reply(`❌ Failed to fetch video for "${searchQuery}".`);
    }

    const { title, download_url } = response.data.result;

    // Send the video
    await message.sendMessage(from, {
      video: { url: download_url },
      mimetype: 'video/mp4',
      caption: title
    }, {
      quoted: client
    });

  } catch (error) {
    console.error('Video command error:', error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
