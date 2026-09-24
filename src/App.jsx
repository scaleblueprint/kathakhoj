import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, Clapperboard,
  Clock3, Headphones, Menu, Pause, Play, Search, Sparkles, Volume2, X
} from 'lucide-react'
import { filters, stories } from './data/stories.js'

const saveKey = 'kathakhoj:saved'
const feedbackKey = 'kathakhoj:feedback'
const progressKey = 'kathakhoj:progress'
const historicalSelections = [
  {id:'the-castaway',title:'The Castaway',author:'Rabindranath Tagore',edition:'Stories from Tagore (1918)',sourcePage:'Stories_from_Tagore/The_Castaway',translator:'Historical English edition; individual translator not established',language:'English translation of Bengali',description:'A historical literary story from a documented 1918 collection.'},
  {id:'the-editor',title:'The Editor',author:'Rabindranath Tagore',edition:'Broken Ties and Other Stories (1925)',sourcePage:'Broken_Ties_and_other_Stories/The_Editor',translator:'William Winstanley Pearson (revised by Tagore)',language:'English translation of Bengali',description:'An actual story in the 1925 published collection.'},
  {id:'giribala',title:'Giribala',author:'Rabindranath Tagore',edition:'Broken Ties and Other Stories (1925)',sourcePage:'Broken_Ties_and_other_Stories/Giribala',translator:'Rabindranath Tagore',language:'English translation of Bengali',description:'An actual story in the 1925 published collection.'}
]

const validationCandidates = [
  {id:'kalikala-vaibhavam',title:'Kalikala Vaibhavam',author:'Moorkoth Kumaran',language:'Malayalam',date:'1896 · reported',kind:'Prose work',status:'Bibliographic details and complete text need validation'},
  {id:'kathasaudham',title:'Kathasaudham · Parts 1–2',author:'Ambadi Narayana Poduval',language:'Malayalam',date:'1923 · reported edition',kind:'Story collection',status:'Contents, edition and complete text need validation'},
  {id:'naalu-kathakal',title:'Naalu Kathakal',author:'Oduvil Kunhikrishna Menon',language:'Malayalam',date:'Edition date unverified',kind:'Four-story collection',status:'Publication date, contents and text need validation'},
  {id:'rebati',title:'Rebati',author:'Fakir Mohan Senapati',language:'Odia',date:'1898 · reported',kind:'Short story',status:'Original edition and translation need validation'},
  {id:'bezbarua-fiction',title:'Early short fiction · title to select',author:'Lakshminath Bezbarua',language:'Assamese',date:'Individual work date unverified',kind:'Author discovery candidate',status:'Specific story, date and source need validation'},
  {id:'bengalee-life',title:'Stories of Bengalee Life',author:'Prabhat Kumar Mukhopadhyay',language:'Bengali',date:'1912 · reported edition',kind:'Story collection',status:'Edition, individual stories and translations need validation'},
  {id:'swarnakumari-stories',title:'Short Stories',author:'Swarnakumari Ghosal',language:'Bengali',date:'1912 · reported edition',kind:'Story collection',status:'Edition, contents and translation credits need validation'}
]

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
  const [historicalText, setHistoricalText] = useState([])
  const [historicalError, setHistoricalError] = useState('')
  const [historicalLoading, setHistoricalLoading] = useState(false)
  const [historicalPart, setHistoricalPart] = useState(0)
  const [historicalSelection, setHistoricalSelection] = useState(null)

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

  const openHistorical = async (selection = null) => {
    setHistoricalSelection(selection)
    setShowPreview(true)
    setReadingLanguage('original')
    setHistoricalPart(0)
    setHistoricalText([])
    setHistoricalLoading(true)
    setHistoricalError('')
    try {
      const domain = selection ? 'en.wikisource.org' : 'ml.wikisource.org'
      const title = selection?.sourcePage || 'ദ്വാരക'
      const url = 'https://' + domain + '/w/api.php?action=parse&page=' + encodeURIComponent(title) + '&prop=text&format=json&origin=*'
      const response = await fetch(url)
      if (!response.ok) throw new Error('Source service unavailable')
      const payload = await response.json()
      if (payload.error || !payload.parse?.text?.['*']) throw new Error('Source page unavailable')
      const doc = new DOMParser().parseFromString(payload.parse.text['*'], 'text/html')
      const root = doc.querySelector('.mw-parser-output')
      if (!root) throw new Error('Source text missing')
      root.querySelectorAll('style,script,nav,.mw-editsection,.reference,.reflist,.noprint,.ws-noexport,table').forEach(node => node.remove())
      const paragraphs = [...root.querySelectorAll('p')].map(p => p.textContent.trim()).filter(p => p.length > 30)
      if (paragraphs.length < 3) throw new Error('Source text could not be confirmed')
      setHistoricalText(paragraphs)
    } catch (error) { setHistoricalError('The complete text could not be loaded here. Open the verified source edition below. No invented substitute will be shown.') }
    finally { setHistoricalLoading(false) }
  }


  if (showPreview) return <div className="app"><header className="topbar"><button className="brand brand--button" onClick={() => setShowPreview(false)}>Katha<span>Khoj</span></button><button className="ghost" onClick={() => setShowPreview(false)}><ArrowLeft size={18}/> Back to discover</button></header><main className="story-page"><section className="story-hero"><div><div className="eyebrow">{historicalSelection ? historicalSelection.edition : 'HISTORICAL MALAYALAM SHORT STORY · 1893'}</div><h1>{historicalSelection ? historicalSelection.title : 'ദ್ವാരക · Dwaraka'}</h1><p className="story-subtitle">{historicalSelection ? historicalSelection.author : 'Vengayil Kunhiraman Nayanar'}</p><p>{historicalSelection ? 'Authentic published English translation loaded from Wikisource. The original Bengali text has not yet been aligned in this edition.' : 'Authentic historical fiction. The original Malayalam text is loaded from its Wikisource edition; the English translation is not yet available.'}</p><a href={historicalSelection ? "https://en.wikisource.org/wiki/" + encodeURIComponent(historicalSelection.sourcePage).replaceAll("%2F","/") : "https://ml.wikisource.org/wiki/ദ്വാരക"} target="_blank" rel="noopener noreferrer">View displayed text and source edition ↗</a></div><div className="visual visual--green visual--hero"><div className="visual__glyph">{historicalSelection ? "ব" : "അ"}</div><div className="visual__region">{historicalSelection ? "Bengali literature · English translation" : "Malayalam literature · original"}</div><div className="visual__caption">{historicalSelection ? 'PUBLISHED HISTORICAL TRANSLATION' : 'ORIGINAL WORK · 1893'}</div></div></section><div className="story-layout"><article className="reader"><section className="summary-panel"><div className="eyebrow">ABOUT THIS WORK</div><h2>{historicalSelection ? historicalSelection.title : "ദ്വാരക"}</h2><p><strong>Author:</strong> {historicalSelection ? historicalSelection.author : 'Vengayil Kunhiraman Nayanar'} · <strong>Edition:</strong> {historicalSelection ? historicalSelection.edition : '1893'} · <strong>Text displayed:</strong> {historicalSelection ? historicalSelection.language : 'Malayalam original'}</p><p><strong>Source edition:</strong> {historicalSelection ? "English Wikisource · historical published translation" : "Malayalam Wikisource · English translation pending"}</p><p><strong>Translator:</strong> {historicalSelection ? historicalSelection.translator : "English translation pending"}</p><div className="eyebrow">SUMMARY · SEPARATE FROM THE STORY</div><p>{historicalSelection ? historicalSelection.description : 'A story connecting a telegraph engineer’s imagination with the legendary city of Dwaraka.'}</p></section><div className="part-reader"><div className="eyebrow">{historicalSelection ? 'ACTUAL PUBLISHED TRANSLATION · READING SECTIONS' : 'ACTUAL ORIGINAL · READING SECTIONS'}</div><div className="eyebrow">{historicalSelection ? 'English · published translation (original Bengali pending)' : 'മലയാളം · original (English translation pending)'}</div>{historicalLoading ? <p>Loading the historical text…</p> : historicalError ? <p role="alert">{historicalError}</p> : <><h2>Reading section {historicalPart + 1} of {Math.ceil(historicalText.length / 5)}</h2>{historicalText.slice(historicalPart * 5, historicalPart * 5 + 5).map((p,i) => <p lang={historicalSelection ? "en" : "ml"} key={i}>{p}</p>)}<div className="part-navigation"><button className="secondary" disabled={historicalPart === 0} onClick={() => setHistoricalPart(historicalPart - 1)}>Previous</button><button className="primary" disabled={(historicalPart + 1) * 5 >= historicalText.length} onClick={() => setHistoricalPart(historicalPart + 1)}>Next section <ArrowRight size={17}/></button></div></>}</div></article><aside className="side-panel"><div className="side-card"><div className="eyebrow">SOURCE & EDITION</div><p>Original author: {historicalSelection ? historicalSelection.author : 'Vengayil Kunhiraman Nayanar'}</p><p>Source edition: {historicalSelection ? historicalSelection.edition : '1893'}</p><p>Text source: {historicalSelection ? 'English Wikisource' : 'Malayalam Wikisource'}</p><p>{historicalSelection ? "Original Bengali text: pending alignment" : "English translation: pending"}</p><p>Translator: {historicalSelection ? historicalSelection.translator : "Not yet assigned"}</p><p className="muted">Reading sections divide the existing prose for navigation; they are not newly invented chapters.</p></div></aside></div></main></div>

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
              <button className="secondary" onClick={() => { openHistorical() }}><BookOpen size={18}/> Read historical story</button>
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

          <div className="candidate-card"><div><div className="eyebrow">HISTORICAL WORK · 1893 · ORIGINAL MALAYALAM</div><h3>ദ്വാരക <span>· Dwaraka</span></h3><p>Malayalam short story by Vengayil Kunhiraman Nayanar. Read the historical Malayalam original inside the app, with author and source information. The English translation is still pending.</p><div className="candidate-tags"><span>Prose only</span><span>Original Malayalam</span><span>English translation pending</span><span>Historical original · 1893</span></div></div><button className="primary" onClick={() => { openHistorical() }}>Read the 1893 original <ArrowRight size={18}/></button></div>
          <div className="demo-heading"><div className="eyebrow">MORE REAL HISTORICAL STORIES</div><h3>Published prose, not prototype fiction</h3><p>These are documented English translations of Bengali originals. Open a story to read the source text in-app; original-language alignment is still pending.</p></div><div className="story-grid">{historicalSelections.map(item => <article className="story-card" key={item.id}><div className="story-card__body"><div className="eyebrow">HISTORICAL PROSE · {item.edition}</div><h3>{item.title}</h3><p>{item.author} · {item.language}</p><p>{item.description}</p><div className="story-card__footer"><span>Published English edition</span><button onClick={() => openHistorical(item)}>Read historical text <ArrowRight size={17}/></button></div></div></article>)}</div>
          <section className="validation-collection" aria-label="Historical works awaiting validation"><div className="demo-heading"><div className="eyebrow">DISCOVERY PREVIEW · NOT YET VERIFIED</div><h3>Beyond Tagore: more voices to explore</h3><p>These are research candidates displayed to test the catalogue design. Titles, dates, source editions, complete texts and translation rights must be validated before publication. These cards do not open a story reader.</p></div><div className="story-grid">{validationCandidates.map(item => <article className="story-card" key={item.id}><div className="story-card__body"><div className="eyebrow">{item.language} · {item.kind}</div><h3>{item.title}</h3><p><strong>{item.author}</strong></p><p>{item.date}</p><div className="candidate-tags"><span>NEEDS VALIDATION</span><span>Not available to read yet</span></div><p className="muted">{item.status}</p><div className="story-card__footer"><span>Catalogue preview only</span><span aria-label="Reading unavailable pending validation">Reader pending</span></div></div></article>)}</div></section>
          <div className="demo-heading"><div className="eyebrow">READABLE STORIES</div><h3>Original-language and English reading</h3><p>The Blue Door is complete in Kannada and English. The other two stories remain clearly labelled English-only demonstrations. The historical Dwaraka reader is available above in Malayalam; its English translation is pending.</p></div>
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
