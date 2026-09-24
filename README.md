# KathaKhoj — prose-first bilingual literary discovery

KathaKhoj is a mobile-first discovery and reading experience for **lesser-known Indian short stories, novellas and novels**. Poems and popular canonical selections are out of scope for this pilot.

## Reading experience

- One uninterrupted editorial summary, separate from the original work.
- Full original-language narrative divided at natural reading breaks.
- Full English translation aligned to those same breaks.
- Language switch, previous/next, reading progress saved in the browser.
- Author, source edition, translator and rights/provenance recorded.

## Publication gate

The public catalogue is intentionally empty while the first qualifying literary work is sourced and translated. Previous poem and original-fiction demonstration entries have been removed. **Do not insert summaries, excerpts, prompts or invented prose into a full-text chapter.**

Every published entry must be a source-verified prose work with complete original text, complete reviewed English translation, and documented permission/public-domain basis for each. Translation copyright may differ from the original work's copyright. Prioritize overlooked works, rather than treating public-domain status as evidence of obscurity.

## Local run

```bash
npm install
npm run dev
npm run build
```

## Render

Static Site; build command `npm install && npm run build`, publish directory `dist`. The repository includes `render.yaml`.

## Editorial next step

Identify one lesser-known Kannada or Malayalam short story with an accessible reliable full-text edition. Verify the author's death date and source rights; prepare a complete English translation with attribution and review; divide both texts at the same narrative breaks; then populate `src/data/stories.js`.
