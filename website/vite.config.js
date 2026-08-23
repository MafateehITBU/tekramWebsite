import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Load the hashed app CSS without blocking first paint (mobile FCP). */
function asyncCss() {
  return {
    name: 'async-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /<link rel="stylesheet"([^>]*href="[^"]+\.css"[^>]*)>/g,
          '<link rel="stylesheet"$1 media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet"$1></noscript>',
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), asyncCss()],
})

