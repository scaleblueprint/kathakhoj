# KathaKhoj V1

KathaKhoj is a mobile-first literary discovery prototype for exploring lesser-known Indian literary worlds through **Read, Listen and Watch** pathways.

## What V1 includes

- Cinematic discovery homepage
- Story search and theme/region filters
- Three original editorial demo stories
- Immersive story reader
- Browser-based sample narration
- Watch-path placeholder for future illustrated storytelling
- Local saved stories
- Local prototype feedback capture
- Literary Trail concept
- Responsive mobile layout
- Render deployment configuration

## Important editorial note

The three stories in V1 are **original editorial demonstration pieces** created only to test the product experience. They are not adaptations, translations, or claimed transcriptions of Kannada, Malayalam, or oral literary works.

Before real literature is published, the production catalogue should record:

1. Original source and edition
2. Author / rights holder
3. Public-domain or licensing status
4. Translation/adaptation permission where needed
5. Human literary review
6. Language and pronunciation review
7. Media provenance and captions

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Deploy on Render

Use **Static Site**:

- Build command: `npm install && npm run build`
- Publish directory: `dist`

A `render.yaml` is included if you prefer Render Blueprint deployment.

## V2 priorities

- Replace sample stories with source-backed, rights-cleared Kannada and Malayalam works
- Add real audio assets and illustrated video
- Add CMS-backed editorial workflow
- Add analytics for completion, repeat exploration and source-link clicks
- Add original-language content and cross-language trails
