import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('dist');
const pages = [
  ['index.html', 'en', 'Bo Yang'],
  ['zh/index.html', 'zh-CN', '杨博'],
  ['blog/index.html', 'en', 'Blog'],
  ['zh/blog/index.html', 'zh-CN', '博客'],
];
for (const [file, language, text] of pages) {
  const path = resolve(root, file);
  assert.ok(existsSync(path), `Missing page: ${file}`);
  const html = readFileSync(path, 'utf8');
  assert.ok(html.includes(`lang="${language}"`), `${file}: wrong language`);
  assert.ok(html.includes(text), `${file}: expected content is missing`);
  assert.doesNotMatch(html, /\b1[3-9]\d{9}\b|\bRANK\b|CV\.docx|Writing template — not published/);
  if (file === 'index.html' || file === 'zh/index.html') {
    assert.match(html, /id="internship"[^>]*data-entry-count="0"/);
    assert.match(html, /id="publications"[^>]*data-entry-count="0"/);
    assert.ok(html.includes('NKCV Lab') && html.includes('VCIP Lab'));
    assert.ok(html.includes('2025.09') && html.includes('2026.07') && html.includes('2026.08'));
  }
  // All root-relative internal links and assets must resolve in the static artifact.
  for (const match of html.matchAll(/\b(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const url = match[1];
    const target = resolve(root, `.${url}`, url.endsWith('/') ? 'index.html' : '');
    assert.ok(existsSync(target), `${file}: broken local link or asset ${url}`);
  }
  console.log(`PASS ${file}`);
}
for (const file of ['404.html', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'images/portrait.png', '.nojekyll']) {
  assert.ok(existsSync(resolve(root, file)), `Missing static asset: ${file}`);
}
assert.ok(!existsSync(resolve(root, 'blog/writing-template/index.html')), 'Draft template was published');
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
assert.match(sitemap, /https:\/\/boyang06-cloud\.github\.io\/zh\/blog\//);
assert.doesNotMatch(sitemap, /writing-template|localhost|127\.0\.0\.1/);
console.log('PASS static assets, draft exclusion, internal links, privacy checks and sitemap');
