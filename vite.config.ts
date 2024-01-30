import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { LayuiVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from "path"

const excludeComponents = ['LightIcon','DarkIcon']

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src')
      }
    ]
  },
  plugins: [
    AutoImport({
      resolvers: [
        LayuiVueResolver(),
      ],
    }),
    Components({
      resolvers: [
        LayuiVueResolver({
          resolveIcons: true,
          exclude: excludeComponents
        }),
      ],
    }),
    vue(),
  ],
  define: {
    'process.env': {
      'BASE_URI': 'http://localhost:8080/graphql',
      'WS_URI': 'ws://localhost:8080/graphql',
      'NODE_ENV': 'dev'
    }
  }
});