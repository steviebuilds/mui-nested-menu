import { defineConfig } from 'tsup';

export default defineConfig({
    banner: { js: '"use client";' },
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    // Classic JSX transform: the automatic one imports 'react/jsx-runtime', which Node ESM and webpack 5
    // cannot resolve under React 17 (no exports map).
    esbuildOptions(options) {
        // esbuild would otherwise follow tsconfig.json ("jsx": "react-jsx").
        delete options.tsconfig;
        options.tsconfigRaw = {
            compilerOptions: {
                jsx: 'react',
                jsxFactory: 'React.createElement',
                jsxFragmentFactory: 'React.Fragment',
            },
        };
        options.jsx = 'transform';
        options.jsxFactory = 'React.createElement';
        options.jsxFragment = 'React.Fragment';
        options.inject = [...(options.inject ?? []), './src/react-shim.ts'];
    },
    external: [/^@mui\//, /^@emotion\//, /^react($|\/)/, /^react-dom($|\/)/],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.js' }),
    sourcemap: false,
    splitting: false,
    target: 'es2019',
});
