import { readFileSync, writeFileSync, existsSync } from "fs"

class Database {
  constructor() {
    this.data = {
      users: {},
      groups: {},
      banned: [],
      settings: {},
    }
    this.file = "./database.json"
    this.load()
  }

  load() {
    if (existsSync(this.file)) {
      try {
        this.data = JSON.parse(readFileSync(this.file, "utf8"))
      } catch (error) {
        console.error("Database load error:", error)
      }
    }
  }

  save() {
    try {
      writeFileSync(this.file, JSON.stringify(this.data, null, 2))
    } catch (error) {
      console.error("Database save error:", error)
    }
  }

  init() {
    setInterval(() => this.save(), 30000) // Auto-save every 30 seconds
  }

  getUser(id) {
    if (!this.data.users[id]) {
      this.data.users[id] = {
        id,
        name: "",
        limit: 100,
        premium: false,
        banned: false,
        warning: 0,
      }
    }
    return this.data.users[id]
  }

  getGroup(id) {
    if (!this.data.groups[id]) {
      this.data.groups[id] = {
        id,
        name: "",
        welcome: true,
        antilink: false,
        mute: false,
      }
    }
    return this.data.groups[id]
  }

  banUser(id) {
    if (!this.data.banned.includes(id)) {
      this.data.banned.push(id)
    }
  }

  unbanUser(id) {
    this.data.banned = this.data.banned.filter((user) => user !== id)
  }

  isBanned(id) {
    return this.data.banned.includes(id)
  }
}

export const DATABASE = new Database()
