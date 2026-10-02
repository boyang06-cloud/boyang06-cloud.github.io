import type { Language } from '../data/site.ts';

export function homePath(language: Language): string {
  return language === 'en' ? '/' : '/zh/';
}

export function blogPath(language: Language): string {
  return language === 'en' ? '/blog/' : '/zh/blog/';
}

export function postPath(language: Language, slug: string): string {
  const normalized = slug.replace(/^\/+|\/+$/g, '');
  if (!normalized || normalized.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error('Invalid blog slug');
  }
  return `${blogPath(language)}${normalized}/`;
}

export function otherLanguage(language: Language): Language {
  return language === 'en' ? 'zh' : 'en';
}
