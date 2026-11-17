import { defineConfig } from 'tsup';

export default defineConfig({
    banner: { js: '"use client";' },
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    external: [/^@mui\//, /^@emotion\//, /^react($|\/)/, /^react-dom($|\/)/],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.js' }),
    sourcemap: false,
    splitting: false,
    target: 'es2019',
});
