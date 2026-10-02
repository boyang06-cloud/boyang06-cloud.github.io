import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { publishedPosts } from '../lib/posts';
import { postPath } from '../lib/routes';

export const GET: APIRoute = async () => {
  const posts = await publishedPosts();
  const paths = ['/', '/zh/', '/blog/', '/zh/blog/', ...posts.map((post) => postPath(post.data.language, post.data.slug))];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${new URL(path, site.origin).href}</loc></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
