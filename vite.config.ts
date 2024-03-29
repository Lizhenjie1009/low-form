const path = require('path')
import { UserConfig, ConfigEnv } from 'vite'
import { createVitePlugins } from './config/vite/plugins'
import proxy from './config/vite/proxy'
import { VITE_DROP_CONSOLE, VITE_PORT } from './config/constant'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  console.log(command, mode)
  return {
    plugins: createVitePlugins(),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '#': path.resolve(__dirname, './types'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    // css
    css: {},

    // server
    server: {
      hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      // 服务配置
      port: VITE_PORT, // 类型： number 指定服务器端口;
      open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: false, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: '0.0.0.0', // IP配置，支持从IP启动
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy
    },

    // build
    build: {
      minify: 'terser',
      target: 'es2015',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE
        }
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: []
        // https://rollupjs.org/guide/en/#big-list-of-options
      },
      chunkSizeWarningLimit: 2000
    }
  }
}
