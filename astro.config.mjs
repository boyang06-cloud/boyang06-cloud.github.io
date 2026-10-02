import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://boyang06-cloud.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
