// Only publish genuine bilingual prose editions. A story must include a complete
// original-language summary and English summary, plus full narrative text in both
// languages for every chapter. English-only demos and poems are excluded.
const catalogue = []
export const stories = catalogue.filter(story =>
  ['short-story','novella','novel'].includes(story.genre) &&
  story.originalLanguage && story.originalLanguage !== 'English' &&
  story.summary?.original?.trim() && story.summary?.english?.trim() &&
  story.rights?.original && story.rights?.english &&
  story.parts?.length > 0 &&
  story.parts.every(part => part.original?.length && part.english?.length &&
    part.original.every(p => p.trim()) && part.english.every(p => p.trim()))
)
export const filters = ['All','Karnataka','Kerala']
