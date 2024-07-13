import fs from 'fs';

const src = 'dist/pagefind';
const dest = 'public/pagefind';

fs.cpSync(src, dest, { recursive: true });