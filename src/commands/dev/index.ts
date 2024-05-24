import { program } from 'commander';
import { createServer, build } from 'vite';
import { importPluginConfig } from '../../lib/import.js';
import { getViteConfig } from '../../lib/vite.js';
import chokidar from 'chokidar';
import path from 'path';
import { WORKSPACE_DIRECTORY } from '../../lib/constants.js';

export default function command() {
  program
    .command('dev')
    .description('Start development server.')
    .action(action);
}

export async function action() {
  console.group('🚀 Start development server');
  try {
    const config = await importPluginConfig();

    const watcher = chokidar.watch(['src/**/*.{ts,js,jsx,tsx}'], {
      ignored: /node_modules/,
      persistent: true,
    });

    const viteConfig = getViteConfig(config);

    const listener = async () =>
      build({
        ...viteConfig,
        mode: 'development',
        build: {
          ...viteConfig.build,
          sourcemap: 'inline',
        },
      });

    await listener();

    watcher.on('change', listener);
    watcher.on('add', listener);
    watcher.on('unlink', listener);

    const server = await createServer({
      ...viteConfig,
      root: path.join(WORKSPACE_DIRECTORY, 'dev'),
      build: undefined,
    });
    await server.listen();

    server.printUrls();
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
}
