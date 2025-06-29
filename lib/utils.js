import axios from "axios"

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const isUrl = (url) => {
  const regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
  return regex.test(url)
}

export const getBuffer = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" })
    return Buffer.from(response.data)
  } catch (error) {
    throw error
  }
}

export const runtime = (seconds) => {
  seconds = Number(seconds)
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
  const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
  const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
  const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
  return dDisplay + hDisplay + mDisplay + sDisplay
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
