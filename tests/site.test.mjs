import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { site, copy } from '../src/data/site.ts';
import { homePath, blogPath, postPath, otherLanguage } from '../src/lib/routes.ts';

test('profile follows the approved name and research priorities', () => {
  assert.equal(site.name, 'Bo Yang');
  assert.equal(site.chineseName, '杨博');
  assert.deepEqual(site.research, ['3D Generation', 'Multimodal Models', 'Efficient AI', 'Agents']);
});

test('internship and publications remain intentionally empty', () => {
  assert.deepEqual(site.internships, []);
  assert.deepEqual(site.publications, []);
});

test('only the two requested lab experiences are present, newest first', () => {
  assert.deepEqual(site.experiences, [
    { lab: 'VCIP Lab', start: '2026.08', end: null },
    { lab: 'NKCV Lab', start: '2025.09', end: '2026.07' },
  ]);
});

test('both languages have the same complete translation keys', () => {
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.zh).sort());
  for (const translations of Object.values(copy)) {
    for (const value of Object.values(translations)) assert.ok(value.length > 0);
  }
});

test('static routes use real directories rather than SPA-only paths', () => {
  assert.equal(homePath('en'), '/');
  assert.equal(homePath('zh'), '/zh/');
  assert.equal(blogPath('en'), '/blog/');
  assert.equal(blogPath('zh'), '/zh/blog/');
  assert.equal(postPath('en', '3d-generation'), '/blog/3d-generation/');
  assert.equal(postPath('zh', 'notes/one'), '/zh/blog/notes/one/');
  assert.equal(otherLanguage(otherLanguage('en')), 'en');
});

test('invalid or traversal-like post slugs fail explicitly', () => {
  for (const slug of ['', '/', '../secret', 'a/../../b', './post']) {
    assert.throws(() => postPath('en', slug), /Invalid blog slug/);
  }
});

test('no private CV, phone number, rank or unreviewed PDF is exposed by profile data', () => {
  const serialized = JSON.stringify(site);
  assert.doesNotMatch(serialized, /\b1[3-9]\d{9}\b|\bRANK\b|CV\.docx|\d{7}@mail\.nankai/);
  assert.equal(site.cvPath, null);
});

test('blog template is a draft and cannot appear as a published article', () => {
  const template = readFileSync(new URL('../src/content/blog/writing-template.md', import.meta.url), 'utf8');
  const schema = readFileSync(new URL('../src/content.config.ts', import.meta.url), 'utf8');
  assert.match(template, /^draft: true$/m);
  assert.match(schema, /draft: z\.boolean\(\)\.default\(true\)/);
});
