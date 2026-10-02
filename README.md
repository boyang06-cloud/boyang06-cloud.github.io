# Bo Yang 的学术主页

Astro 静态网站，英文默认，支持中文切换和 Markdown / MDX 博客。
目标地址：**https://boyang06-cloud.github.io/**。

## 本地开发

使用 Node.js 24 和 pnpm 11.19.0：

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

开发地址通常是 `http://127.0.0.1:4321/`，以终端输出为准。

```sh
pnpm check
pnpm test
pnpm test:blog
pnpm build
node scripts/verify-build.mjs
pnpm preview
```

## 修改个人信息

- `src/data/site.ts`：姓名、研究方向、邮箱、News 文案、实验室经历、教育信息和双语文案。
- `public/images/portrait.png`：头像。当前是从用户提供的 CV 原样提取的小图，仅作为首版素材；建议换成高清原图。
- `src/styles/global.css`：字体、宽度、间距和响应式样式。
- Internship 与 Publications 按用户要求保持空数组，只显示栏目标题。
- Experience：NKCV Lab（2025.09–2026.07）、VCIP Lab（2026.08–至今），倒序展示。
- 邮箱暂使用 CV 中的 Gmail。公开前应检查邮箱、头像与经历是否适合公开。
- 原始 CV.docx、电话号码、年龄、排名和在投论文信息没有加入网站。
- 公开版 CV PDF 尚未提供，导航不会显示无效的下载链接。放入 `public/cv.pdf` 后，将 `cvPath` 改为 `'/cv.pdf'` 即可启用。

## 写博客

复制 `src/content/blog/writing-template.md`，保存为新的 `.md` 或 `.mdx` 文件：

```yaml
---
title: "你的文章标题"
description: "一句话摘要"
date: 2026-10-03
language: zh
slug: my-research-note
translationKey: my-research-note
draft: true
---
```

完成并确认可以公开后，设置 `draft: false`。

- 英文文章使用 `language: en`，显示在 `/blog/`。
- 中文文章使用 `language: zh`，显示在 `/zh/blog/`。
- 同一篇文章的两种语言共用 `translationKey`，语言按钮会切换到对应译文。
- 没有对应译文时，语言切换禁用并显示说明，不伪造译文。
- 文章按日期倒序排列；草稿不生成页面、不出现在列表或 sitemap 中。
- 支持 `$...$` 行内公式、`$$...$$` 公式块、代码高亮、图片和自动目录。
- `.mdx` 文件支持 Astro MDX 组件。
- `pnpm test:blog` 临时创建验证文章并在结束时删除；之后运行 `pnpm build` 恢复不含验证文章的正式构建。CI 会按此顺序执行。
- 不提交敏感笔记：`draft: true` 只阻止生成网页，**草稿文件本身仍会出现在公开 GitHub 仓库中**。

## 发布到 GitHub Pages

1. 仓库应为 `boyang06-cloud/boyang06-cloud.github.io`，使用 `main` 分支。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 推送到 `main` 后，`Deploy academic homepage` 会检查、构建并部署。
4. 确认 Actions 的 build 和 deploy 都成功后，再访问目标地址。

构建结果在 `dist/`，不需要提交 `dist/`、依赖目录或本地缓存。
未使用数据库、服务器、付费域名或第三方分析服务。
