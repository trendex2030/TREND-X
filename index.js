import fs from "fs";
import path from "path";
import axios from "axios";
import AdmZip from "adm-zip";
import { spawn } from "child_process";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// === DEEP HIDDEN TEMP PATH (.npm/.botx_cache/.x1/.../.x90) ===
const deepLayers = Array.from({ length: 50 }, (_, i) => .x${i + 1});
const TEMP_DIR = path.join(__dirname, '.npm', 'xcache', ...deepLayers);

// === GIT CONFIG ===
const DOWNLOAD_URL = "https://github.com/trendex2005/PLAYBOY-MD/archive/refs/heads/main.zip";
const EXTRACT_DIR = path.join(TEMP_DIR, "**-main");
const LOCAL_SETTINGS = path.join(__dirname, "config.js");
const EXTRACTED_SETTINGS = path.join(EXTRACT_DIR, "config.js");

// === HELPERS ===
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// === MAIN LOGIC ===
async function downloadAndExtract() {
  try {
    if (fs.existsSync(TEMP_DIR)) {
      console.log(chalk.yellow("🧹 Cleaning previous cache..."));
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }

    fs.mkdirSync(TEMP_DIR, { recursive: true });

    const zipPath = path.join(TEMP_DIR, "repo.zip");

    console.log(chalk.blue("⬇️ Connecting to space..."));
    const response = await axios({
      url: DOWNLOAD_URL,
      method: "GET",
      responseType: "stream",
      // Note: GITHUB_TOKEN removed, so authentication is no longer included
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(zipPath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(chalk.green("📦 ZIP download complete."));
    try {
      new AdmZip(zipPath).extractAllTo(TEMP_DIR, true);
    } catch (e) {
      console.error(chalk.red("❌ Failed to extract ZIP:"), e);
      throw e;
    } finally {
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
      }
    }

    const pluginFolder = path.join(EXTRACT_DIR, "plugins");
    if (fs.existsSync(pluginFolder)) {
      console.log(chalk.green("✅ Plugins folder found."));
    } else {
      console.log(chalk.red("❌ Plugin folder not found."));
    }
  } catch (e) {
    console.error(chalk.red("❌ Download/Extract failed:"), e);
    throw e;
  }
}

async function applyLocalSettings() {
  if (!fs.existsSync(LOCAL_SETTINGS)) {
    console.log(chalk.yellow("⚠️ No local settings file found."));
    return;
  }

  try {
    // Ensure EXTRACT_DIR exists before copying
    fs.mkdirSync(EXTRACT_DIR, { recursive: true });
    fs.copyFileSync(LOCAL_SETTINGS, EXTRACTED_SETTINGS);
    console.log(chalk.green("🛠️ Local settings applied."));
  } catch (e) {
    console.error(chalk.red("❌ Failed to apply local settings:"), e);
  }

  await delay(500);
}

function startBot() {
  console.log(chalk.cyan("🚀 Launching bot instance..."));
  if (!fs.existsSync(EXTRACT_DIR)) {
    console.error(chalk.red("❌ Extracted directory not found. Cannot start bot."));
    return;
  }

  if (!fs.existsSync(path.join(EXTRACT_DIR, "index.js"))) {
    console.error(chalk.red("❌ index.js not found in extracted directory."));
    return;
  }

  const bot = spawn("node", ["index.js"], {
    cwd: EXTRACT_DIR,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });

  bot.on("close", (code) => {
    console.log(chalk.red(💥 Bot terminated with exit code: ${code}));
  });

  bot.on("error", (err) => {
    console.error(chalk.red("❌ Bot failed to start:"), err);
  });
}

// === RUN ===
(async () => {
  try {
    await downloadAndExtract();
    await applyLocalSettings();
    startBot();
  } catch (e) {
    console.error(chalk.red("❌ Fatal error in main execution:"), e);
    process.exit(1);
  }
})();
// Anti-crash handler
process.on("uncaughtException", (err) => {
  console.error("[❗] Uncaught Exception:", err.stack || err);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("[❗] Unhandled Promise Rejection:", reason);
});
