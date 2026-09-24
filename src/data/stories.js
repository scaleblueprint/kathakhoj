// Publication gate: only source-verified prose fiction with the complete original
// and a complete, permission-cleared English translation may appear here.
// Each part must contain ACTUAL narrative text, never summary or reading prompts.
// Example schema:
// { id, title, genre: 'short-story' | 'novella' | 'novel', originalLanguage,
//   originalLocale, author, translator, sourceTitle, sourceUrl, published,
//   rights: { original: 'public-domain' | 'licensed', english: 'original-translation' | 'licensed' },
//   summary, essence, parts: [{ title, original: ['Full prose...'], english: ['Full translation...'] }] }
// Do not publish entries with missing parts, placeholder prose, or incomplete translation.
const catalogue = []
export const stories = catalogue.filter(story =>
  ['short-story', 'novella', 'novel'].includes(story.genre) &&
  story.rights?.original && story.rights?.english &&
  story.parts?.length > 0 &&
  story.parts.every(part => part.original?.length && part.english?.length)
)
export const filters = ['All', 'Karnataka', 'Kerala']
