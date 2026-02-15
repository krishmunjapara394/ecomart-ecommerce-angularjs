// Test script that extracts and tests ALL image URLs from the current seed.mjs
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const content = readFileSync(join(__dirname, '..', 'seed.mjs'), 'utf8');
const regex = /https:\/\/images\.unsplash\.com\/photo-[^"]+/g;
const urls = new Set();
let m;
while (m = regex.exec(content)) urls.add(m[0]);

console.log('Total unique URLs in seed.mjs: ' + urls.size);

const broken = [];
const working = [];

for (const url of urls) {
    try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        if (res.ok) {
            working.push(url);
        } else {
            broken.push(url + ' => HTTP ' + res.status);
        }
    } catch (err) {
        broken.push(url + ' => ERROR: ' + err.message);
    }
}

console.log('Working: ' + working.length);
console.log('Broken: ' + broken.length);
if (broken.length > 0) {
    console.log('');
    broken.forEach(b => console.log('BROKEN: ' + b));
} else {
    console.log('ALL IMAGES ARE VALID!');
}
