// Copies what npm needs next to the built bundles: the root README (with npm-specific UTM tags),
// the LICENSE and package.template.json (published as package.json).
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rootDir = resolve(packageDir, '../..');
const dist = resolve(packageDir, 'dist');

mkdirSync(dist, { recursive: true });

// GitHub and npm readers are told apart in analytics by utm_medium.
const readme = readFileSync(resolve(rootDir, 'README.md'), 'utf8').replaceAll(
    'utm_medium=github',
    'utm_medium=npm-readme'
);
writeFileSync(resolve(dist, 'README.md'), readme);

copyFileSync(resolve(rootDir, 'LICENSE'), resolve(dist, 'LICENSE'));
copyFileSync(resolve(packageDir, 'package.template.json'), resolve(dist, 'package.json'));

console.log('Copied README.md, LICENSE and package.json into dist/');
