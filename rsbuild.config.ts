import { join } from "node:path"
import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack"

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    favicon: "./public/img/ISI-icon-logo2.ico",
    tags: [
      {
        tag: "link",
        attrs: {
          rel: "preload",
          fetchpriority: "high",
          as: "image",
          href: "/img/logo-gray.svg",
          type: "image/webp",
        },
      },
      {
        tag: "link",
        attrs: {
          rel: "preload",
          fetchpriority: "high",
          as: "image",
          href: "/img/user-icon.webp",
          type: "image/webp",
        },
      },
    ],
  },
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack({
          target: "react",
          autoCodeSplitting: true,
        }),
      ],
    },
  },
  server: {
    open: false,
    publicDir: {
      name: join(__dirname, "public"),
    },
    host: "0.0.0.0",
  },
})
