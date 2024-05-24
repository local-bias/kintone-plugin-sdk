import { InlineConfig } from 'vite';
import path from 'path';
import fs from 'fs-extra';
import { DEFAULT_PORT, WORKSPACE_DIRECTORY } from './constants.js';

export const getViteConfig = (config: Plugin.Meta.Config): InlineConfig => {
  return {
    configFile: false,
    build: {
      outDir: path.join(WORKSPACE_DIRECTORY, 'dev'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          config: path.join('src', 'config', 'index.ts'),
          desktop: path.join('src', 'desktop', 'index.ts'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
    server: {
      port: config.server?.port ?? DEFAULT_PORT,
      https: {
        key: fs.readFileSync(
          path.join(WORKSPACE_DIRECTORY, 'localhost-key.pem')
        ),
        cert: fs.readFileSync(
          path.join(WORKSPACE_DIRECTORY, 'localhost-cert.pem')
        ),
      },
    },
  };
};
