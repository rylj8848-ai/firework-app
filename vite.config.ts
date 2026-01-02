
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    // 关键配置：让前端代码可以使用 process.env.API_KEY
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
