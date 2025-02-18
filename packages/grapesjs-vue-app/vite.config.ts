import { UserConfig, defineConfig } from 'vite';
import path from "path";
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import fs from 'fs';
import fsExtra from 'fs-extra';
import dotenv from 'dotenv';
import packageJson from "./package.json";

const { removeSync, copySync } = fsExtra;

const dirCwd = process.cwd();
const serverOpts: UserConfig['server'] = {};
const indexDev = '_index.html';

if (fs.existsSync(`${dirCwd}/${indexDev}`)) {
  serverOpts.open = indexDev;
}

const copyGrapesjsReactPlugin = {
  name: 'copy-grapesjs-react',
  buildStart() {
    const sourcePath = path.resolve(__dirname, '../grapesjs-react/dist');
    const destPath = path.resolve(__dirname, 'node_modules/@grapesjs/react');
    
    // Remove the destination directory to clean up the cache
    if (fs.existsSync(destPath)) {
      removeSync(destPath);
      console.log('Removed existing @grapesjs/react directory');
    }
    
    // Copy the files
    copySync(sourcePath, destPath, { overwrite: true });
    console.log('Copied @grapesjs/react files');
  },
};

const packageAliases = {
  '@grapesjs/react': path.resolve(__dirname, '../grapesjs-react'),
};

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, char => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  es: `${getPackageName()}.js`,

  // Deprecated: Due to the code splitting issue, we don't use iife format anymore
  // iife: `${getPackageName()}.iife.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  dotenv.config({ path: `.env.${mode}` });

  return {
    plugins: [vue(), dts(), copyGrapesjsReactPlugin],
    server: {
      ...serverOpts
    },
    base: "./",
    build: {
      outDir: "./build/dist",
      lib: {
        entry: path.resolve(__dirname, "src/WebEditor/index.tsx"),
        name: getPackageNameCamelCase(),
        formats,
        fileName: format => fileName[format],
      },
      minify: true,
      manifest: true,
      sourcemap: false,
      target: 'es2015',
      rollupOptions: {
        output: {
          manualChunks(id) {
            for (const [alias, _] of Object.entries(packageAliases)) {
              if (id.includes(alias)) {
                return alias;
              }
            }
          },
          chunkFileNames() {
            return '[name]-[hash].js';
          },
          // Ensure inlineDynamicImports is not enabled
          inlineDynamicImports: false,
        },
      },
    },
    css: {
      modules: {
        localsConvention: 'dashes',
      },
      preprocessorOptions: {
        scss: {},
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: [
        // Alias for the main source directory
        { find: "@", replacement: path.resolve(__dirname, "src") },

        // Alias for the root directory
        { find: "@@", replacement: path.resolve(__dirname) },

        // Alias for the easy-email-* packages
        // ...Object.entries(packageAliases).map(([find, replacement]) => ({
        //   find,
        //   replacement,
        // })),
      ],
    },
  }
});
