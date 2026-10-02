import { getCollection, type CollectionEntry } from 'astro:content';
import type { Language } from '../data/site';

export type BlogPost = CollectionEntry<'blog'>;

export async function publishedPosts(language?: Language): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const paths = new Set<string>();
  const translations = new Set<string>();
  for (const post of posts) {
    const path = `${post.data.language}:${post.data.slug}`;
    const translation = `${post.data.language}:${post.data.translationKey}`;
    if (paths.has(path)) throw new Error(`Duplicate blog slug: ${path}`);
    if (translations.has(translation)) throw new Error(`Duplicate translation key: ${translation}`);
    paths.add(path);
    translations.add(translation);
  }
  return posts
    .filter((post) => !language || post.data.language === language)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatPostDate(date: Date, language: Language): string {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(date);
}
