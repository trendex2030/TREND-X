const { cmd } = require('../command'); // Assuming you have a command handler
const axios = require('axios'); // For making HTTP requests to GitHub API
const fs = require('fs'); // For saving downloaded files

// GitHub repository details
const REPO_OWNER = 'caseyweb';
const REPO_NAME = 'CASEYRHODES-XMD';
const PLUGINS_FOLDER = 'plugins'; // Folder where plugins are stored

// GitHub API base URL
const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PLUGINS_FOLDER}`;

// Store the list of plugins temporarily
let pluginListCache = [];

// Command to list all plugins
cmd({
    pattern: "listplugins", // Command trigger
    alias: ["pluginslist", "listplugs", "listplugin"], // Aliases
    use: '.listplugins', // Example usage
    react: "📂", // Emoji reaction
    desc: "List all available plugins in the bot's repository.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply }) => {
    try {
        // Fetch the folder structure from GitHub
        const response = await axios.get(GITHUB_API_URL);
        const plugins = response.data.filter(item => item.type === 'file'); // Only list files

        if (plugins.length === 0) {
            return reply("*No plugins found in the repository.*");
        }

        // Cache the plugin list for reply functionality
        pluginListCache = plugins;

        // Construct a list of plugins
        let pluginList = "📂 *CASEYRHODES-XMD PLUGINS:*\n\n";
        plugins.forEach((plugin, index) => {
            pluginList += `${index + 1}. ${plugin.name}\n> `; // Add plugin name to the list
        });

        // Add instructions for downloading
        pluginList += "\n*Reply with the file number or file name to download.*";

        // Send the list to the user
        await reply(pluginList);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch plugins from the repository. Please try again later.*");
    }
});

// Command to download a specific plugin
cmd({
    pattern: "plugin", // Command trigger
    alias: ["downloadplugin", "getplugin"], // Aliases
    use: '.plugin <plugin_name>', // Example usage
    react: "⬇️", // Emoji reaction
    desc: "Download a specific plugin from the bot's repository.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, args, senderNumber }) => {
    try {
        let pluginName = args[0]; // Get the plugin name or number from the argument

        // If the user is replying to a message, check if it's a number
        if (m.quoted && m.quoted.key.fromMe) {
            const quotedText = m.quoted.text;
            if (/📂 \*CASEYRHODES-XMD PLUGINS:\*/i.test(quotedText)) {
                // Extract the number from the reply
                const fileNumber = parseInt(pluginName);
                if (!isNaN(fileNumber) && fileNumber > 0 && fileNumber <= pluginListCache.length) {
                    pluginName = pluginListCache[fileNumber - 1].name;
                }
            }
        }

        // Check if the user provided a plugin name
        if (!pluginName) {
            return reply("*Please provide a plugin name or number to download.*\nExample: `.plugin ytdl.js` or reply with `.plugin 1`");
        }

        // Fetch the plugin file from GitHub
        const response = await axios.get(`${GITHUB_API_URL}/${pluginName}`);
        const pluginUrl = response.data.download_url; // Get the download URL

        // Download the plugin file
        const pluginResponse = await axios.get(pluginUrl, { responseType: 'arraybuffer' });
        const pluginPath = `./${pluginName}`; // Save the file locally

        // Save the file to the local system
        fs.writeFileSync(pluginPath, pluginResponse.data);

        // Status message with image and caption
        const statusMessage = {
            image: { url: `https://i.ibb.co/99HSnG03/lordali.jpg` }, // Replace with your image URL
            caption: `*Successfully downloaded ${pluginName} ✅*`,
            contextInfo: {
                mentionedJid: [senderNumber],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363302677217436@newsletter',
                    newsletterName: 'ᴄᴀsᴇʏʀʜᴏᴅᴇs ʜᴇʟᴘ🍁',
                    serverMessageId: 143
                }
            }
        };

        // Send the file to the user
        await conn.sendMessage(
            from,
            {
                document: fs.readFileSync(pluginPath),
                mimetype: 'application/javascript', // MIME type for JS files
                fileName: pluginName
            },
            { quoted: mek }
        );

        // Send the status message
        await conn.sendMessage(from, statusMessage, { quoted: mek });

        // Delete the local file after sending
        fs.unlinkSync(pluginPath);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to download the plugin. Please check the plugin name or try again later.*");
    }
});
