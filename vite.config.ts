import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "watch-theme",
      configureServer(server) {
        server.watcher.add("public/theme.css")
        server.watcher.on("change", path => {
          if (path.endsWith("public/theme.css")) {
            server.ws.send({ type: "full-reload" })
          }
        })
      },
    },
  ],
})
