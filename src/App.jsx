import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, Clapperboard,
  Clock3, Headphones, Menu, Pause, Play, Search, Sparkles, Volume2, X
} from 'lucide-react'
import { filters, stories } from './data/stories.js'

const saveKey = 'kathakhoj:saved'
const feedbackKey = 'kathakhoj:feedback'
const progressKey = 'kathakhoj:progress'

function Visual({ story, hero = false }) {
  return (
    <div className={`visual visual--${story.accent} ${hero ? 'visual--hero' : ''}`}>
      <div className="visual__ring visual__ring--one" />
      <div className="visual__ring visual__ring--two" />
      <div className="visual__glyph">{story.accent === 'amber' ? '✦' : story.accent === 'green' ? '〰' : '↝'}</div>
      <div className="visual__region">{story.region}</div>
      <div className="visual__caption">KATHAKHOJ · EDITORIAL SAMPLE</div>
    </div>
  )
}

function App() {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [menu, setMenu] = useState(false)
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(saveKey)) || [] } catch { return [] }
  })
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(() => { try { return JSON.parse(localStorage.getItem(progressKey)) || {} } catch { return {} } })
  const [feedback, setFeedback] = useState('')
  const [readingLanguage, setReadingLanguage] = useState('original')
  const [showPreview, setShowPreview] = useState(false)

  const filtered = useMemo(() => stories.filter(s => {
    const matchesQuery = [s.title, s.subtitle, s.region, s.theme, typeof s.summary === 'string' ? s.summary : s.summary?.original, s.summary?.english]
      .join(' ').toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'All' || s.region === filter || s.theme === filter
    return matchesQuery && matchesFilter
  }), [query, filter])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (!selected) {
      window.speechSynthesis?.cancel()
      setPlaying(false)
    }
  }, [selected])

  const setPart = (id, index) => {
    window.speechSynthesis?.cancel()
    setPlaying(false)
    const next = { ...progress, [id]: index }
    setProgress(next)
    localStorage.setItem(progressKey, JSON.stringify(next))
    document.getElementById('reading-part')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleSaved = (id) => {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }

  const speak = (story, partIndex) => {
    if (!('speechSynthesis' in window)) return
    if (playing) {
      window.speechSynthesis.cancel()
      setPlaying(false)
      return
    }
    const part = story.parts[partIndex]
    const lines = part ? (part[readingLanguage]?.length ? part[readingLanguage] : part.original) : [story.essence]
    const utterance = new SpeechSynthesisUtterance([story.title, part?.title || 'Literary companion', ...lines].join(' '))
    utterance.lang = readingLanguage === 'original' ? story.originalLocale : 'en-IN'
    utterance.rate = 0.93
    utterance.pitch = 0.92
    utterance.onend = () => setPlaying(false)
    window.speechSynthesis.speak(utterance)
    setPlaying(true)
  }

  const submitFeedback = () => {
    if (!feedback.trim()) return
    const entry = { feedback: feedback.trim(), at: new Date().toISOString() }
    let items = []
    try { items = JSON.parse(localStorage.getItem(feedbackKey)) || [] } catch {}
    localStorage.setItem(feedbackKey, JSON.stringify([...items, entry]))
    setFeedback('')
    alert('Thanks — your feedback is saved in this browser for the prototype.')
  }

  if (showPreview) return <div className="app"><header className="topbar"><button className="brand brand--button" onClick={() => setShowPreview(false)}>Katha<span>Khoj</span></button><button className="ghost" onClick={() => setShowPreview(false)}><ArrowLeft size={18}/> Back to discover</button></header><main className="story-page"><section className="story-hero"><div><div className="eyebrow">MALAYALAM · SHORT STORY · EDITORIAL INTAKE</div><h1>ദ്വാരക · Dwaraka</h1><p className="story-subtitle">Vengayil Kunhiraman Nayanar</p><p className="preview-status">In preparation — not yet a published bilingual edition</p><p>A lesser-known prose candidate. The complete source edition and English translation must be verified before the full reader can open.</p></div><div className="visual visual--green visual--hero"><div className="visual__glyph">അ</div><div className="visual__region">Malayalam literature</div><div className="visual__caption">SOURCE & TRANSLATION REVIEW</div></div></section><div className="story-layout"><article className="reader"><section className="summary-panel"><div className="eyebrow">SEPARATE SUMMARY</div><h2>About this work</h2><p>This selection is being researched. A verified editorial synopsis will appear here after the source text is checked. It will not be split into chapters or substituted for the story.</p></section><div className="part-reader"><div className="eyebrow">FULL-TEXT READER · PREVIEW OF STRUCTURE</div><h2>Original and English, part by part</h2><div className="language-switch"><button className={readingLanguage === 'original' ? 'active' : ''} onClick={() => setReadingLanguage('original')}>മലയാളം · Original</button><button className={readingLanguage === 'english' ? 'active' : ''} onClick={() => setReadingLanguage('english')}>English translation</button></div><div className="source-reading"><p><strong>{readingLanguage === 'original' ? 'Complete Malayalam narrative' : 'Complete English translation'}</strong></p><p>{readingLanguage === 'original' ? 'Awaiting verification of a complete reusable source edition. No excerpt or reading prompt will be presented as the original story.' : 'Awaiting a complete, reviewed translation aligned with the original text. No summary will be presented as a translation.'}</p><p className="muted">Reading parts will contain actual prose, not summaries. Publication remains locked until both languages are complete.</p></div></div></article><aside className="side-panel"><div className="side-card"><div className="eyebrow">PUBLICATION CHECKLIST</div><p>✓ Prose fiction, not poetry</p><p>✓ Candidate and author identified</p><p>○ Complete original edition verified</p><p>○ Complete English translation reviewed</p><p>○ Both texts aligned in the reader</p><p className="muted">This is an honest UI preview, not a claim that the full work is available.</p></div></aside></div></main></div>

  if (selected) {
    const story = stories.find(s => s.id === selected)
    if (!story) return null
    const isSaved = saved.includes(story.id)
    const partIndex = Math.min(progress[story.id] || 0, story.parts.length)
    const complete = partIndex === story.parts.length
    const currentPart = story.parts[partIndex]
    const sourceLinked = Boolean(story.sourceUrl)
    const isDemo = story.originalLanguage === 'English'
    return (
      <div className="app">
        <header className="topbar">
          <button className="brand brand--button" onClick={() => setSelected(null)}>Katha<span>Khoj</span></button>
          <button className="ghost" onClick={() => setSelected(null)}><ArrowLeft size={18} /> Back to discover</button>
        </header>

        <main className="story-page">
          <section className="story-hero">
            <div>
              <div className="eyebrow">{story.region} · {story.inspiredLanguage}</div>
              <h1>{story.title}</h1>
              <p className="story-subtitle">{story.subtitle}</p>
              <div className="meta-row">
                <span><Clock3 size={16} /> {story.duration}</span>
                <span><BookOpen size={16} /> Read</span>
                <span><Headphones size={16} /> Listen</span>
                <span><Clapperboard size={16} /> Watch preview</span>
              </div>
              <div className="story-actions">
                {sourceLinked && <a className="primary" href={story.sourceUrl} target="_blank" rel="noopener noreferrer">View source edition <ArrowRight size={18}/></a>}
                <button className="primary" onClick={() => speak(story, partIndex)}>
                  {playing ? <Pause size={18}/> : <Play size={18}/>}
                  {playing ? 'Stop narration' : 'Listen to this chapter'}
                </button>
                <button className="secondary" onClick={() => toggleSaved(story.id)}>
                  {isSaved ? <BookmarkCheck size={18}/> : <Bookmark size={18}/>}
                  {isSaved ? 'Saved' : 'Save story'}
                </button>
              </div>
            </div>
            <Visual story={story} hero />
          </section>

          <div className="story-layout">
            <article className="reader">
              <div className="prototype-note"><Sparkles size={17}/><span><strong>{story.originalLanguage === 'English' ? 'Demo library:' : 'Source and translation:'}</strong> {story.note}</span></div>
              <section className="summary-panel"><div className="eyebrow">ABOUT THIS WORK</div><h2>{story.originalTitle || story.title}</h2><p><strong>Author / creator:</strong> {story.author || "Not recorded"} · <strong>First published:</strong> {story.published || "Not established"}</p><p><strong>Original language:</strong> {story.originalLanguage} · <strong>English translation:</strong> {story.originalLanguage === "English" ? "Not applicable" : (story.translator || "Not recorded")}</p><p><strong>Edition:</strong> {story.edition || "KathaKhoj demonstration edition"}</p><hr/><div className="eyebrow">STORY SUMMARY · NOT A CHAPTER</div><h2>The story at a glance</h2><div className="language-switch" role="group" aria-label="Summary and story language"><button className={readingLanguage === 'original' ? 'active' : ''} onClick={() => setReadingLanguage('original')}>{story.originalLanguage} · Original</button><button className={readingLanguage === 'english' ? 'active' : ''} onClick={() => setReadingLanguage('english')}>English translation</button></div><p lang={readingLanguage === 'original' ? story.originalLocale : 'en'}>{typeof story.summary === 'string' ? story.summary : story.summary[readingLanguage]}</p></section>
              <div id="reading-part" className="part-reader">
                <div className="eyebrow">{complete ? 'STORY COMPLETE' : `CHAPTER ${partIndex + 1} OF ${story.parts.length}`}</div>
                {story.parts[0].english.length > 0 && <div className="language-switch" role="group" aria-label="Reading language"><button className={readingLanguage === 'original' ? 'active' : ''} onClick={() => { window.speechSynthesis?.cancel(); setPlaying(false); setReadingLanguage('original') }}>{story.originalLanguage} · Original</button><button className={readingLanguage === 'english' ? 'active' : ''} onClick={() => { window.speechSynthesis?.cancel(); setPlaying(false); setReadingLanguage('english') }}>English translation</button></div>}
                <div className="progress-track" role="progressbar" aria-valuenow={partIndex} aria-valuemin="0" aria-valuemax={story.parts.length} aria-label="Story progress"><span style={{ width: `${partIndex / story.parts.length * 100}%` }} /></div>
                {complete ? <section className="essence"><h2>The literary companion</h2><p>{story.essence}</p><p className="muted">You have reached the end of the complete story in this reader.</p></section> : <>
                  <h2>{currentPart.title}</h2>
                  {(currentPart[readingLanguage]?.length ? currentPart[readingLanguage] : currentPart.original).map((p, i) => <p key={i} lang={readingLanguage === 'original' ? story.originalLocale : 'en'}>{p}</p>)}
                </>}
                <div className="part-navigation">
                  <button className="secondary" disabled={partIndex === 0} onClick={() => setPart(story.id, partIndex - 1)}><ArrowLeft size={17}/> Previous</button>
                  <span>{complete ? 'Finished' : `Chapter ${partIndex + 1} / ${story.parts.length}`}</span>
                  <button className="primary" onClick={() => setPart(story.id, complete ? 0 : partIndex + 1)}>{complete ? 'Read again' : partIndex === story.parts.length - 1 ? 'Finish story' : 'Next part'} <ArrowRight size={17}/></button>
                </div>
              </div>
            </article>

            <aside className="side-panel">
              <div className="side-card">
                <div className="eyebrow">FULL STORY · CHAPTERS</div>
                <div className="part-list">{story.parts.map((part, i) => <button key={i} className={i === partIndex ? 'part-link active' : 'part-link'} onClick={() => setPart(story.id, i)}><span>{String(i + 1).padStart(2, '0')}</span>{part.title}</button>)}<button className={complete ? 'part-link active' : 'part-link'} onClick={() => setPart(story.id, story.parts.length)}>Literary companion</button></div>
                <div className="eyebrow">EXPERIENCE</div>
                <button className="experience active"><BookOpen size={18}/> Read <span>Open</span></button>
                <button className="experience" onClick={() => speak(story, partIndex)}><Volume2 size={18}/> Listen <span>{playing ? 'Playing' : story.duration}</span></button>
                <button className="experience" onClick={() => alert('Illustrated video is a Phase 2 production asset.')}><Clapperboard size={18}/> Watch <span>Preview</span></button>
              </div>
              <div className="side-card">
                <div className="eyebrow">ABOUT THIS WORK</div>
                <h3>{story.originalTitle || story.title}</h3>
                <p><strong>Author / creator:</strong> {story.author || 'Not recorded'}</p>
                <p><strong>Original language:</strong> {story.originalLanguage}</p>
                <p><strong>First publication:</strong> {story.published || 'Not established'}</p>
                <p><strong>Edition:</strong> {story.edition || (isDemo ? 'KathaKhoj demonstration edition' : 'Not recorded')}</p>
                <p><strong>English translation:</strong> {isDemo ? 'Not applicable — originally written in English' : (story.translator || 'Not recorded')}</p>
                <p><strong>Source:</strong> {story.sourceTitle || (isDemo ? 'Original demonstration fiction' : 'Not recorded')}</p>
                {story.sourceUrl && <p><a href={story.sourceUrl} target="_blank" rel="noopener noreferrer">View source edition ↗</a></p>}
                <p><strong>Rights / status:</strong> {story.publicationStatus || (isDemo ? 'Newly written English-only demo' : 'See editorial note')}</p>
                <p className="muted">{story.note}</p>
              </div>
              <div className="side-card">
                <div className="eyebrow">EDITORIAL STATUS</div>
                <p><strong>{story.type}</strong></p>
                <p className="muted">{story.originalLanguage === 'English' ? 'Original English demonstration fiction. No Kannada or Malayalam translation is claimed.' : 'Complete original-language narrative and English translation, aligned chapter by chapter.'}</p>
                {sourceLinked && <p className="muted"><strong>Author:</strong> {story.author}<br/><strong>First published:</strong> {story.published}<br/><strong>Translation:</strong> {story.translator}<br/><a href={story.sourceUrl} target="_blank" rel="noopener noreferrer">{story.sourceTitle} ↗</a></p>}
                <p className="muted">Historical literary editions require verified source, rights and translation credits before publication.</p>
              </div>
            </aside>
          </div>

          <section className="next-story">
            <div>
              <div className="eyebrow">CONTINUE EXPLORING</div>
              <h2>Follow another literary trail</h2>
            </div>
            <button className="secondary" onClick={() => {
              const index = stories.findIndex(s => s.id === story.id)
              setSelected(stories[(index + 1) % stories.length].id)
            }}>Next story <ArrowRight size={18}/></button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Katha<span>Khoj</span></div>
        <nav className={menu ? 'nav nav--open' : 'nav'}>
          <button onClick={() => document.getElementById('discover')?.scrollIntoView({behavior:'smooth'})}>Discover</button>
          <button onClick={() => document.getElementById('why')?.scrollIntoView({behavior:'smooth'})}>Why KathaKhoj</button>
          <button onClick={() => document.getElementById('feedback')?.scrollIntoView({behavior:'smooth'})}>Feedback</button>
        </nav>
        <button className="menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero__copy">
            <div className="eyebrow"><Sparkles size={15}/> REDISCOVER INDIA THROUGH ITS STORIES</div>
            <h1>Stories beyond<br/><em>the familiar.</em></h1>
            <p>Lesser-known Indian short stories and novels, with one clear summary and the complete narrative in its original language and English — never poems or summary-filled chapters.</p>
            <div className="hero__actions">
              <button className="primary" onClick={() => document.getElementById('discover')?.scrollIntoView({behavior:'smooth'})}>Start discovering <ArrowRight size={18}/></button>
              <button className="secondary" onClick={() => { setReadingLanguage('original'); setShowPreview(true) }}><BookOpen size={18}/> Preview bilingual reader</button>
            </div>
            <div className="format-strip">
              <span><BookOpen size={17}/> Original + English</span>
              <span><Headphones size={17}/> Listen</span>
              <span><Clapperboard size={17}/> Watch</span>
            </div>
          </div>
          {stories[0] ? <Visual story={stories[0]} hero /> : <div className="visual visual--green visual--hero"><div className="visual__glyph">✦</div><div className="visual__region">Stories worth rediscovering</div><div className="visual__caption">COMPLETE ORIGINAL · COMPLETE ENGLISH TRANSLATION</div></div>}
        </section>

        <section className="manifesto" id="why">
          <p className="quote">“I know India has an extraordinary literary heritage. I just don’t know where to begin.”</p>
          <p className="manifesto__body">KathaKhoj begins with that problem: not a shortage of literature, but a shortage of inviting pathways into it.</p>
        </section>

        <section className="discover" id="discover">
          <div className="section-head">
            <div>
              <div className="eyebrow">BEGIN YOUR JOURNEY</div>
              <h2>Discover lesser-known prose</h2>
            </div>
            <p>Regional catalogue: original-language and English summaries plus full bilingual chapters. The English-only demos remain separately labelled below while the first edition is prepared.</p>
          </div>

          <div className="candidate-card"><div><div className="eyebrow">FIRST REGIONAL SELECTION · IN PREPARATION</div><h3>ദ്വാരക <span>· Dwaraka</span></h3><p>Malayalam short story by Vengayil Kunhiraman Nayanar. A separate summary and complete original/English reading experience are being prepared.</p><div className="candidate-tags"><span>Prose only</span><span>Original Malayalam</span><span>English translation</span><span>Source verification pending</span></div></div><button className="primary" onClick={() => { setReadingLanguage('original'); setShowPreview(true) }}>View bilingual reader preview <ArrowRight size={18}/></button></div>
          <div className="demo-heading"><div className="eyebrow">READABLE STORIES</div><h3>Original-language and English reading</h3><p>The Blue Door is complete in Kannada and English. The other two stories remain clearly labelled English-only demonstrations. A verified historical literary edition is still in preparation.</p></div>
          <div className="controls">
            <div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stories, places or themes…" /></div>
            <div className="chips">
              {filters.map(f => <button key={f} className={filter === f ? 'chip active' : 'chip'} onClick={() => setFilter(f)}>{f}</button>)}
            </div>
          </div>

          <div className="story-grid">
            {filtered.map(story => (
              <article className="story-card" key={story.id}>
                <button className="card-save" aria-label="Save story" onClick={() => toggleSaved(story.id)}>
                  {saved.includes(story.id) ? <BookmarkCheck size={18}/> : <Bookmark size={18}/>}
                </button>
                <Visual story={story} />
                <div className="story-card__body">
                  <div className="eyebrow">{story.region} · {story.originalLanguage === 'English' ? 'ENGLISH-ONLY DEMO' : 'KANNADA + ENGLISH · COMPLETE'} · {story.theme}</div>
                  <h3>{story.title}</h3>
                  <p>{typeof story.summary === 'string' ? story.summary : story.summary.english}</p>
                  <div className="story-card__footer">
                    <span>{progress[story.id] > 0 ? `Continue · ${Math.min(progress[story.id] + 1, story.parts.length)} / ${story.parts.length}` : `${story.parts.length} chapters · ${story.duration}`}</span>
                    <button onClick={() => { setReadingLanguage('original'); setSelected(story.id) }}>Read full story <ArrowRight size={17}/></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && <div className="empty"><h3>{stories.length ? 'No stories match yet.' : 'More stories are being prepared.'}</h3><p>{stories.length ? 'Try another theme.' : 'The earlier English-only demos have been removed. The first regional work will appear when its full original and full English translation are ready.'}</p></div>}
        </section>

        <section className="trail">
          <div className="trail__copy">
            <div className="eyebrow">THE LITERARY TRAIL</div>
            <h2>One human question.<br/>Many literary worlds.</h2>
            <p>Start with a story from Karnataka, follow the same theme into Kerala, and eventually travel across languages, regions and generations.</p>
          </div>
          <div className="trail__path">
            <span>KANNADA</span><i>→</i><span>MALAYALAM</span><i>→</i><span>TAMIL</span><i>→</i><span>BENGALI</span>
          </div>
        </section>

        <section className="feedback" id="feedback">
          <div>
            <div className="eyebrow">HELP SHAPE THE PILOT</div>
            <h2>Would you come back for another story?</h2>
            <p>Tell us what would make this genuinely useful: better narration, regional language, deeper context, different stories, or something else.</p>
          </div>
          <div className="feedback__box">
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Share your reaction to the idea…"/>
            <button className="primary" onClick={submitFeedback}>Save feedback</button>
            <small>Prototype: feedback is stored only in this browser.</small>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand">Katha<span>Khoj</span></div>
        <p>A discovery project for India’s lesser-known literary worlds.</p>
      </footer>
    </div>
  )
}

export default App
