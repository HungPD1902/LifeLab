import { readFile, writeFile } from 'node:fs/promises';

// Keep index.html byte-for-byte identical to GameDoAn; only the host entry adds a bridge.
const root = new URL('../public/games/gamedoan/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
await writeFile(
  new URL('lifelab.html', root),
  html
    .replace('</head>', '  <link rel="stylesheet" href="lesson-one.css">\n</head>')
    .replace('</body>', '  <script src="lifelab-bridge.js"></script>\n</body>'),
);
