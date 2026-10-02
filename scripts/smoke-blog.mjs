import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const root = process.cwd();
const contentRoot = resolve(root, 'src/content/blog');
const created = [];
const fixtures = [
  ['verify-smoke-en.mdx', 'en', 'verify-smoke-pair', 'verify-smoke-pair', '<div className="mdx-verification">MDX component works.</div>'],
  ['verify-smoke-zh.md', 'zh', 'verify-smoke-pair', 'verify-smoke-pair', '中文验证内容。'],
  ['verify-smoke-single.md', 'en', 'verify-smoke-single', 'verify-smoke-single', 'An English-only verification fixture.'],
];

try {
  for (const [name, language, slug, translationKey, body] of fixtures) {
    const path = resolve(contentRoot, name);
    assert.ok(path.startsWith(contentRoot + sep), 'Fixture path must stay inside the blog directory');
    writeFileSync(path, `---\ntitle: "Verification fixture"\ndescription: "Temporary test content; never shipped."\ndate: 2026-10-03\nlanguage: ${language}\nslug: ${slug}\ntranslationKey: ${translationKey}\ndraft: false\n---\n\n## A test heading\n\n${body}\n\nInline math: $x^2$.\n\n$$\nx^2 + y^2 = z^2\n$$\n\n\`\`\`python\nx = 1\n\`\`\`\n`, { flag: 'wx' });
    created.push(path);
  }
  execFileSync(process.execPath, [resolve(root, 'node_modules/astro/astro.js'), 'build'], {
    cwd: root, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }, stdio: 'inherit',
  });
  const en = readFileSync(resolve(root, 'dist/blog/verify-smoke-pair/index.html'), 'utf8');
  const zh = readFileSync(resolve(root, 'dist/zh/blog/verify-smoke-pair/index.html'), 'utf8');
  const single = readFileSync(resolve(root, 'dist/blog/verify-smoke-single/index.html'), 'utf8');
  for (const html of [en, zh]) {
    assert.match(html, /class="katex/);
    assert.match(html, /katex-display/);
    assert.match(html, /class="astro-code/);
    assert.match(html, /href="#a-test-heading"/);
  }
  assert.match(en, /mdx-verification/);
  assert.match(en, /MDX component works/);
  assert.match(en, /href="\/zh\/blog\/verify-smoke-pair\/"/);
  assert.match(zh, /href="\/blog\/verify-smoke-pair\/"/);
  assert.match(single, /A Chinese translation is not available/);
  assert.match(single, /aria-disabled="true"/);
  assert.ok(!existsSync(resolve(root, 'dist/blog/writing-template/index.html')));
  console.log('PASS Markdown, MDX, inline/display math, code highlighting, heading links, translated routes and unavailable translations');
} finally {
  for (const path of created) unlinkSync(path);
  console.log('Removed all temporary blog fixtures. Run pnpm build for the clean production artifact.');
}
