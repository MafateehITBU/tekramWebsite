import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Desktop keeps a blocking stylesheet (CLS). Mobile paints the HTML hero first. */
function mobileAsyncCss() {
  return {
    name: 'mobile-async-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /<link rel="stylesheet"([^>]*href="([^"]+\.css)"[^>]*)>/g,
          (_match, attrs, href) => {
            const escaped = href.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
            return (
              `<script>(function(){var h='${escaped}';` +
              'if(window.innerWidth>=768){document.write(\'<link rel="stylesheet" crossorigin href="\'+h+\'">\')}' +
              'else{document.write(\'<link rel="stylesheet" crossorigin href="\'+h+\'" media="print" onload="this.media=\\\'all\\\'">\')}' +
              '})();</script>' +
              `<noscript><link rel="stylesheet"${attrs}></noscript>`
            )
          },
        )
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mobileAsyncCss()],
})

