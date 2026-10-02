---
title: "Writing template — not published"
description: "A private drafting template for future blog posts."
date: 2026-10-03
language: en
slug: writing-template
translationKey: writing-template
draft: true
---

This file is a writing template, not a published article. Copy it to start a post,
change the metadata, and set `draft: false` only when it is ready to publish.

## A section heading

Write your own research notes here. Inline math is supported: $x \in \mathbb{R}^3$.

$$
\mathcal{L} = \mathbb{E}_{x \sim p(x)}\left[\|f_\theta(x)-x\|_2^2\right]
$$

```python
def hello():
    return "Write your own example here."
```

Local images go in `public/images/`; reference them as `/images/your-image.png`.
For a translated post, reuse the same `translationKey` with a different `language`.
