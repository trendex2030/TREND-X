import { readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
export const plugins = []

export async function loadPlugins() {
  const pluginDir = join(__dirname, "../plugins")
  const files = readdirSync(pluginDir).filter((file) => file.endsWith(".js"))

  for (const file of files) {
    try {
      const plugin = await import(`../plugins/${file}`)
      if (plugin.default) {
        plugins.push(plugin.default)
        console.log(`✅ Loaded plugin: ${file}`)
      }
    } catch (error) {
      console.error(`❌ Failed to load plugin ${file}:`, error)
    }
  }

  console.log(`📦 Loaded ${plugins.length} plugins`)
}
