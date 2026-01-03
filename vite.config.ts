
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
      // 将警告限制调整为 1500KB，消除第三方库打包过大时的感叹号警告
      chunkSizeWarningLimit: 1500,
    },
    // 不再向前端注入 process.env.API_KEY，改用后端 API 路由
    define: {
      // 保持为空或删除该行，避免密钥泄露到前端代码中
    }
  }
})
