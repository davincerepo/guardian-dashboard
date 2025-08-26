import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src'), // 如果你想用 @ 也可以
    },
  },
});
