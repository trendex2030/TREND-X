const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint (required for Heroku)
app.get("/", (req, res) => {
  res.json({
    status: "TREND-X Bot is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
})

// API endpoints
app.get("/api/status", (req, res) => {
  res.json({
    bot: "TREND-X",
    status: "active",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  })
})

// Bot logic endpoints
app.post("/api/webhook", (req, res) => {
  console.log("Webhook received:", req.body)

  // Add your bot logic here
  // This is where you'd handle incoming messages/commands

  res.json({ success: true, message: "Webhook processed" })
})

// Trends API endpoint
app.get("/api/trends", async (req, res) => {
  try {
    // Add your trend analysis logic here
    const trends = [
      { id: 1, topic: "AI Technology", growth: 85, volume: 12500 },
      { id: 2, topic: "Crypto Markets", growth: -12, volume: 8900 },
      { id: 3, topic: "Climate Action", growth: 67, volume: 15600 },
    ]

    res.json({
      success: true,
      data: trends,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching trends:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch trends",
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({
    success: false,
    error: "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  })
})

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 TREND-X Bot server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  process.exit(0)
})
