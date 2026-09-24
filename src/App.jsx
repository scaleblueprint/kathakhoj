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

  const filtered = useMemo(() => stories.filter(s => {
    const matchesQuery = [s.title, s.subtitle, s.region, s.theme, s.summary]
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
    const utterance = new SpeechSynthesisUtterance(
      [story.title, story.parts[partIndex]?.title || 'Literary companion', ...(story.parts[partIndex]?.paragraphs || [story.essence])].join('. ')
    )
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

  if (selected) {
    const story = stories.find(s => s.id === selected)
    const isSaved = saved.includes(story.id)
    const partIndex = Math.min(progress[story.id] || 0, story.parts.length)
    const complete = partIndex === story.parts.length
    const currentPart = story.parts[partIndex]
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
                <button className="primary" onClick={() => speak(story, partIndex)}>
                  {playing ? <Pause size={18}/> : <Play size={18}/>}
                  {playing ? 'Stop narration' : 'Listen to this part'}
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
              <div className="prototype-note"><Sparkles size={17}/><span><strong>Prototype note:</strong> {story.note}</span></div>
              <div id="reading-part" className="part-reader">
                <div className="eyebrow">{complete ? 'STORY COMPLETE' : `PART ${partIndex + 1} OF ${story.parts.length}`}</div>
                <div className="progress-track" role="progressbar" aria-valuenow={partIndex} aria-valuemin="0" aria-valuemax={story.parts.length} aria-label="Story progress"><span style={{ width: `${partIndex / story.parts.length * 100}%` }} /></div>
                {complete ? <section className="essence"><h2>The literary companion</h2><p>{story.essence}</p><p className="muted">You have reached the end of this original demonstration story. The full literary catalogue will provide author, source edition, language, and rights information here.</p></section> : <>
                  <h2>{currentPart.title}</h2>
                  {currentPart.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </>}
                <div className="part-navigation">
                  <button className="secondary" disabled={partIndex === 0} onClick={() => setPart(story.id, partIndex - 1)}><ArrowLeft size={17}/> Previous</button>
                  <span>{complete ? 'Finished' : `Part ${partIndex + 1} / ${story.parts.length}`}</span>
                  <button className="primary" onClick={() => setPart(story.id, complete ? 0 : partIndex + 1)}>{complete ? 'Read again' : partIndex === story.parts.length - 1 ? 'Finish story' : 'Next part'} <ArrowRight size={17}/></button>
                </div>
              </div>
            </article>

            <aside className="side-panel">
              <div className="side-card">
                <div className="eyebrow">STORY PARTS</div>
                <div className="part-list">{story.parts.map((part, i) => <button key={i} className={i === partIndex ? 'part-link active' : 'part-link'} onClick={() => setPart(story.id, i)}><span>{String(i + 1).padStart(2, '0')}</span>{part.title}</button>)}<button className={complete ? 'part-link active' : 'part-link'} onClick={() => setPart(story.id, story.parts.length)}>Literary companion</button></div>
                <div className="eyebrow">EXPERIENCE</div>
                <button className="experience active"><BookOpen size={18}/> Read <span>Open</span></button>
                <button className="experience" onClick={() => speak(story, partIndex)}><Volume2 size={18}/> Listen <span>{playing ? 'Playing' : story.duration}</span></button>
                <button className="experience" onClick={() => alert('Illustrated video is a Phase 2 production asset.')}><Clapperboard size={18}/> Watch <span>Preview</span></button>
              </div>
              <div className="side-card">
                <div className="eyebrow">EDITORIAL STATUS</div>
                <p><strong>{story.type}</strong></p>
                <p className="muted">Text access: {story.textAccess === 'original-demo' ? 'Original demonstration text' : story.textAccess}</p>
                <p className="muted">The production catalogue will only publish works after source, rights and human literary review are recorded.</p>
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
            <p>Discover remarkable literary worlds from across India — thoughtfully introduced, easy to enter, and designed to make you want to explore the original work.</p>
            <div className="hero__actions">
              <button className="primary" onClick={() => document.getElementById('discover')?.scrollIntoView({behavior:'smooth'})}>Start discovering <ArrowRight size={18}/></button>
              <button className="secondary" onClick={() => setSelected(stories[0].id)}><Headphones size={18}/> Try a story</button>
            </div>
            <div className="format-strip">
              <span><BookOpen size={17}/> Read</span>
              <span><Headphones size={17}/> Listen</span>
              <span><Clapperboard size={17}/> Watch</span>
            </div>
          </div>
          <Visual story={stories[0]} hero />
        </section>

        <section className="manifesto" id="why">
          <p className="quote">“I know India has an extraordinary literary heritage. I just don’t know where to begin.”</p>
          <p className="manifesto__body">KathaKhoj begins with that problem: not a shortage of literature, but a shortage of inviting pathways into it.</p>
        </section>

        <section className="discover" id="discover">
          <div className="section-head">
            <div>
              <div className="eyebrow">BEGIN YOUR JOURNEY</div>
              <h2>Discover a story</h2>
            </div>
            <p>These first pieces are original editorial demonstrations. The real catalogue will be source-backed and rights-cleared.</p>
          </div>

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
                  <div className="eyebrow">{story.region} · {story.theme}</div>
                  <h3>{story.title}</h3>
                  <p>{story.summary}</p>
                  <div className="story-card__footer">
                    <span>{progress[story.id] > 0 ? `Continue · ${Math.min(progress[story.id] + 1, story.parts.length)} / ${story.parts.length}` : `${story.parts.length} parts · ${story.duration}`}</span>
                    <button onClick={() => setSelected(story.id)}>Explore <ArrowRight size={17}/></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && <div className="empty">No stories match yet. Try another theme.</div>}
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
