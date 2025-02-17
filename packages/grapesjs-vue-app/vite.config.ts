import { UserConfig, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import dotenv from 'dotenv';

const dirCwd = process.cwd();
const serverOpts: UserConfig['server'] = {};
const indexDev = '_index.html';

if (fs.existsSync(`${dirCwd}/${indexDev}`)) {
  serverOpts.open = indexDev;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  dotenv.config({ path: `.env.${mode}` });

  return {
    plugins: [vue()],
    server: {
      ...serverOpts
    }
  }
});
