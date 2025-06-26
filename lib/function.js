const fs = require('fs');
const axios = require('axios');

/**
 * Download file from URL and return buffer
 */
const getBuffer = async (url, options = {}) => {
  try {
    const res = await axios({
      method: 'get',
      url,
      headers: {
        DNT: 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get admin IDs from group metadata
 */
const getGroupAdmins = (participants) => {
  const admins = [];
  for (let participant of participants) {
    if (participant.admin !== null) admins.push(participant.id);
  }
  return admins;
};

/**
 * Generate random ID with a suffix
 */
const getRandom = (ext = '') => {
  return '' + Math.floor(Math.random() * 10000) + ext;
};

/**
 * Human readable number formatter
 */
const h2k = (num) => {
  const SI_POSTFIXES = ["", "K", "M", "B", "T", "P", "E"];
  const tier = Math.log10(Math.abs(num)) / 3 | 0;
  if (tier == 0) return num;
  const postfix = SI_POSTFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  let scaled = num / scale;
  let formatted = scaled.toFixed(1);
  if (/\.0$/.test(formatted)) formatted = formatted.substr(0, formatted.length - 2);
  return formatted + postfix;
};

/**
 * Check if a string is a URL
 */
const isUrl = (text) => {
  return text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi);
};

/**
 * JSON beautifier
 */
const Json = (obj) => {
  return JSON.stringify(obj, null, 2);
};

/**
 * Format uptime/runtime duration from seconds
 */
const runtime = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const dayDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hourDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  const minuteDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  const secondDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dayDisplay + hourDisplay + minuteDisplay + secondDisplay;
};

/**
 * Delay utility
 */
const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Fetch and parse JSON from URL
 */
const fetchJson = async (url, options = {}) => {
  try {
    const res = await axios({
      method: 'GET',
      url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
      },
      ...options,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
};
