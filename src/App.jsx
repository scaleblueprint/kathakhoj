import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, Clapperboard,
  Clock3, Headphones, Menu, Pause, Play, Search, Sparkles, Volume2, X
} from 'lucide-react'
import { filters, stories } from './data/stories.js'
import { inspirationLibrary, storySeeds, pilot, voiceModes, createVariation } from './data/creatorStudio.js'

const saveKey = 'kathakhoj:saved'
const feedbackKey = 'kathakhoj:feedback'
const progressKey = 'kathakhoj:progress'
const historicalSelections = [
  {id:'the-castaway',title:'The Castaway',author:'Rabindranath Tagore',edition:'Stories from Tagore (1918)',sourcePage:'Stories_from_Tagore/The_Castaway',translator:'Historical English edition; individual translator not established',language:'English translation of Bengali',description:'A young castaway enters a household after a storm, changing the relationships within it.'},
  {id:'the-editor',title:'The Editor',author:'Rabindranath Tagore',edition:'Broken Ties and Other Stories (1925)',sourcePage:'Broken_Ties_and_other_Stories/The_Editor',translator:'William Winstanley Pearson (revised by Tagore)',language:'English translation of Bengali',description:'A published short story from the 1925 collection; detailed synopsis awaits source review.'},
  {id:'giribala',title:'Giribala',author:'Rabindranath Tagore',edition:'Broken Ties and Other Stories (1925)',sourcePage:'Broken_Ties_and_other_Stories/Giribala',translator:'Rabindranath Tagore',language:'English translation of Bengali',description:'An actual story in the 1925 published collection.'}
]

const validationCandidates = [
  {id:'kalikala-vaibhavam',title:'Kalikala Vaibhavam',author:'Moorkoth Kumaran',language:'Malayalam',date:'1896 · reported',kind:'Prose work',hook:'Explore an early Malayalam prose work and the literary world in which it appeared.',status:'Bibliographic details and complete text need validation'},
  {id:'kathasaudham',title:'Kathasaudham · Parts 1–2',author:'Ambadi Narayana Poduval',language:'Malayalam',date:'1923 · reported edition',kind:'Story collection',hook:'Explore a historical Malayalam story collection, with several narratives gathered in one edition.',status:'Contents, edition and complete text need validation'},
  {id:'naalu-kathakal',title:'Naalu Kathakal',author:'Oduvil Kunhikrishna Menon',language:'Malayalam',date:'Edition date unverified',kind:'Four-story collection',hook:'A four-story collection offering several perspectives on early Malayalam prose.',status:'Publication date, contents and text need validation'},
  {id:'rebati',title:'Rebati',author:'Fakir Mohan Senapati',language:'Odia',date:'1898 · reported',kind:'Short story',hook:'A girl’s education becomes the centre of a changing community.',status:'Original edition and translation need validation'},
  {id:'bezbarua-fiction',title:'Early short fiction · title to select',author:'Lakshminath Bezbarua',language:'Assamese',date:'Individual work date unverified',kind:'Author discovery candidate',hook:'Meet an influential Assamese prose writer; a specific story will be selected after source verification.',status:'Specific story, date and source need validation'},
  {id:'prabhat-wiles',title:'The Wiles of a Pleader',author:'Prabhat Kumar Mukhopadhyay',language:'Bengali',date:'Stories of Bengalee Life · 1912',kind:'Short story',hook:'A lesser-seen Bengali story in a historical English edition, with chapters to explore.',status:'Published English translation; original Bengali alignment pending',sourcePage:'Stories_of_Bengalee_Life/The_Wiles_of_a_Pleader',sourceDomain:'en.wikisource.org',readerReady:true,chaptered:true,chapterCount:5,translator:'Prabhat Kumar Mukhopadhyay'},
  {id:'prabhat-release',title:'His Release',author:'Prabhat Kumar Mukhopadhyay',language:'Bengali',date:'Stories of Bengalee Life · 1912',kind:'Short story',hook:'Explore a distinct voice in early Bengali fiction through a chaptered historical translation.',status:'Published English translation; original Bengali alignment pending',sourcePage:'Stories_of_Bengalee_Life/His_Release',sourceDomain:'en.wikisource.org',readerReady:true,chaptered:true,chapterCount:8,translator:'Prabhat Kumar Mukhopadhyay'},
  {id:'prabhat-forest',title:'The Forest Child',author:'Prabhat Kumar Mukhopadhyay',language:'Bengali',date:'Stories of Bengalee Life · 1912',kind:'Short story',hook:'Discover a story from a 1912 Bengali collection through its historical English edition.',status:'Published English translation; original Bengali alignment pending',sourcePage:'Stories_of_Bengalee_Life/The_Forest_Child',sourceDomain:'en.wikisource.org',readerReady:true,chaptered:true,chapterCount:3,translator:'See source edition'},
  {id:'diddubatu',title:'Diddubatu',author:'Gurajada Apparao',language:'Telugu',date:'Early 20th century · verify edition',kind:'Short story',hook:'A domestic story that invites readers to question social assumptions.',status:'Original edition, publication date and English translation need validation'},
  {id:'ponnagaram',title:'Ponnagaram',author:'Pudhumaipithan',language:'Tamil',date:'20th century · verify edition',kind:'Short story',hook:'A sharp, unsettling glimpse of city life and social inequality.',status:'Source text and translation availability need validation'},
  {id:'kadavulum-kandasami',title:'Kadavulum Kandasami Pillaiyum',author:'Pudhumaipithan',language:'Tamil',date:'20th century · verify edition',kind:'Satirical short story',hook:'What happens when the divine meets an ordinary person in everyday life?',status:'Source edition and translation need validation'},
  {id:'mosarina-mangamma',title:'Mosarina Mangamma',author:'Masti Venkatesha Iyengar',language:'Kannada',date:'20th century · verify edition',kind:'Short story',hook:'A character-led portrait of a woman and the world around her.',status:'Publication details, source and translation need validation'},
  {id:'bade-ghar-ki-beti',title:'Bade Ghar Ki Beti',author:'Munshi Premchand',language:'Hindi',date:'Early 20th century · verify edition',kind:'Short story',hook:'A family conflict becomes a study of pride, relationships and reconciliation.',status:'Original text edition and translation need validation'},
  {id:'balyakalasakhi',title:'Balyakalasakhi',author:'Vaikom Muhammad Basheer',language:'Malayalam',date:'1944 · reported',kind:'Novella',hook:'A tender, bittersweet story of childhood bonds and the lives that follow.',status:'Edition and licensed reading text need validation; discovery metadata only'},
  {id:'swarnakumari-stories',title:'Short Stories',author:'Swarnakumari Ghosal',language:'Bengali',date:'1912 · reported edition',kind:'Story collection',hook:'Explore early Bengali short fiction by a woman writer whose work deserves a wider readership.',status:'Edition, contents and translation credits need validation'}
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

const creatorSeries = [
 {id:'auto',title:'The Last Fare',inspiration:'Everyday kindness · inspired by the honest auto-driver reflection',format:'Human-interest fiction',premise:'An auto driver quietly keeps a notebook of things passengers leave behind. One forgotten letter changes how he sees the city.',episodes:['A passenger who does not speak','The letter without an address','A familiar face at the hospital','The fare that was never collected'],channels:['YouTube · 6–8 min narrative','Instagram/Reels · 45–60 sec hook','Podcast · 10 min reflective episode'],question:'How often do we overlook the person who made our day possible?'},
 {id:'cassette',title:'The Cassette Shop at the Corner',inspiration:'Music and childhood memory',format:'Nostalgic ensemble fiction',premise:'When an old cassette shop is about to close, a young visitor discovers that each unclaimed tape carries a different family memory.',episodes:['A song nobody requested','The tape marked 1994','The customer who never returned','One last song before closing'],channels:['YouTube · illustrated episodes','Shorts · memory-led teasers','Audio · sound-rich narration'],question:'Can a song take us somewhere that no longer exists?'},
 {id:'mind',title:'The Conversation I Never Had',inspiration:'Inner dialogue and everyday decisions',format:'Reflective contemporary fiction',premise:'A commuter imagines conversations with strangers, until one ordinary exchange forces him to act instead of merely thinking.',episodes:['Two empty seats','A story I invented','The question at the signal','What I finally said'],channels:['YouTube · first-person narration','Reels · one reflective question','Podcast · character diary'],question:'Do we know people—or only the stories we tell ourselves about them?'},
 {id:'postcard',title:'Postcards from the Wrong Address',inspiration:'Belonging, travel and listening to others',format:'Interconnected regional fiction',premise:'Misdelivered postcards travel between a Bengaluru apartment, a coastal town and a railway waiting room, connecting people who have never met.',episodes:['The blue postcard','The house that moved','A stranger reads the message','Return to sender'],channels:['YouTube · episodic travel fiction','Shorts · postcard microstories','Audio · bilingual adaptation after review'],question:'What makes a place feel like home?'}
]
function App() {
  const [selected, setSelected] = useState(null)
  const [creatorPage, setCreatorPage] = useState(false)
  const [creatorSeriesId, setCreatorSeriesId] = useState('one-stop')
  const [studioTab, setStudioTab] = useState('stories')
  const [studioMode, setStudioMode] = useState('Surprise me')
  const [studioCount, setStudioCount] = useState(4)
  const [studioIndex, setStudioIndex] = useState(0)
  const [customInfluence, setCustomInfluence] = useState('')
  const [studioLedger, setStudioLedger] = useState(() => { try { return JSON.parse(localStorage.getItem('kathakhoj:story-ledger')) || [] } catch { return [] } })
  const [extraInfluences, setExtraInfluences] = useState(() => { try { return JSON.parse(localStorage.getItem('kathakhoj:inspirations')) || [] } catch { return [] } })
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
  const [sourceChapter, setSourceChapter] = useState(1)

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

  const openHistorical = async (selection = null, chapter = 1) => {
    if (selection?.chaptered && (chapter < 1 || chapter > selection.chapterCount)) return
    setSourceChapter(chapter)
    setHistoricalSelection(selection)
    setShowPreview(true)
    setReadingLanguage(selection ? 'english' : 'original')
    setHistoricalPart(0)
    setHistoricalText([])
    setHistoricalLoading(true)
    setHistoricalError('')
    try {
      const domain = selection?.sourceDomain || (selection ? 'en.wikisource.org' : 'ml.wikisource.org')
      const title = selection?.sourcePage ? selection.sourcePage + (selection.chaptered ? '/Chapter_' + chapter : '') : 'ദ്വാരക'
      const url = 'https://' + domain + '/w/api.php?action=parse&page=' + encodeURIComponent(title) + '&prop=text&format=json&origin=*'
      const response = await fetch(url)
      if (!response.ok) throw new Error('Source service unavailable')
      const payload = await response.json()
      if (payload.error || !payload.parse?.text?.['*']) throw new Error('Source page unavailable')
      const doc = new DOMParser().parseFromString(payload.parse.text['*'], 'text/html')
      const root = doc.querySelector('.mw-parser-output')
      if (!root) throw new Error('Source text missing')
      root.querySelectorAll('style,script,nav,.mw-editsection,.reference,.reflist,.noprint,.ws-noexport,table').forEach(node => node.remove())
      const paragraphs = [...root.querySelectorAll('p')].map(p => p.textContent.trim()).filter(p => p.length > 0)
      if (paragraphs.length < 2 || paragraphs.join(' ').length < 250) throw new Error('Source text could not be confirmed')
      setHistoricalText(paragraphs)
    } catch (error) { setHistoricalError('The complete text could not be loaded here. Open the verified source edition below. No invented substitute will be shown.') }
    finally { setHistoricalLoading(false) }
  }


  if (creatorPage) {
    const catalogue = [...storySeeds,...studioLedger]
    const current = catalogue.find(s => s.id === creatorSeriesId) || storySeeds[0]
    const influences = [...inspirationLibrary,...extraInfluences]
    const saveLedger = (next) => { setStudioLedger(next); localStorage.setItem('kathakhoj:story-ledger',JSON.stringify(next)) }
    const saveInfluences = (next) => { setExtraInfluences(next); localStorage.setItem('kathakhoj:inspirations',JSON.stringify(next)) }
    const generate = () => { let index=studioIndex, next; do { next=createVariation(index++,studioMode,studioCount) } while(catalogue.some(s=>s.id===next.id) && index<10000); setStudioIndex(index); saveLedger([...studioLedger,next]); setCreatorSeriesId(next.id); setStudioTab('stories') }
    return <div className="app"><header className="topbar"><button className="brand brand--button" onClick={() => setCreatorPage(false)}>Katha<span>Khoj</span></button><button className="ghost" onClick={() => setCreatorPage(false)}><ArrowLeft size={18}/> Back to Discover</button></header><main className="story-page"><section className="story-hero"><div><div className="eyebrow">CREATOR STUDIO · STORY LAB</div><h1>New stories, your voice.</h1><p>Original series ideas shaped by your 23-blog writing profile and literary themes. Influences are documented; the plots and prose are new fiction, not attributed to the source authors.</p><p><strong>Voice:</strong> Begin with a situated incident, retain small details and incidental humour, let thoughts wander naturally, and avoid compulsory morals or artificial cliffhangers.</p></div><div className="visual visual--green visual--hero"><div className="visual__glyph">✦</div><div className="visual__region">Story Lab</div><div className="visual__caption">INSPIRATION · SERIES · EPISODES</div></div></section>
    <section className="discover"><div className="part-navigation" role="tablist" aria-label="Creator Studio sections">{[['stories','Story Lab'],['inspiration','Inspiration Library'],['ledger','Story Ledger']].map(([id,label])=><button key={id} role="tab" aria-selected={studioTab===id} className={studioTab===id?'primary':'secondary'} onClick={()=>setStudioTab(id)}>{label}</button>)}</div></section>
    {studioTab==='stories' && <section className="discover"><div className="section-head"><div><div className="eyebrow">GENERATE A SERIES PROPOSAL</div><h2>Start with a fresh situation</h2></div></div><div className="story-grid"><article className="story-card"><div className="story-card__body"><label htmlFor="story-mode">Writing mode</label><select id="story-mode" value={studioMode} onChange={e=>setStudioMode(e.target.value)}><option>Surprise me</option>{voiceModes.map(m=><option key={m}>{m}</option>)}</select><label htmlFor="story-count">Episode count</label><select id="story-count" value={studioCount} onChange={e=>setStudioCount(Number(e.target.value))}>{[3,4,6,8].map(n=><option key={n} value={n}>{n}</option>)}</select><p><small>Creates a new proposal from the curated seed library. It does not call an AI service or write a complete script automatically.</small></p><button className="primary" onClick={generate}><Sparkles size={17}/> Generate proposal</button></div></article><article className="story-card"><div className="story-card__body"><h3>Story development workflow</h3><p>1. Select literary ingredients and an everyday situation.</p><p>2. Review the original premise and episode arc.</p><p>3. Develop and approve complete prose.</p><p>4. Adapt the approved master for video, Shorts and audio.</p><p><small>Only the first pilot has a complete drafted episode. Other entries are explicitly outlines.</small></p></div></article></div><div className="section-head"><h2>Series shelf</h2><p>{catalogue.length} proposals, including {studioLedger.length} locally generated.</p></div><div className="story-grid">{catalogue.map(s=><article className="story-card" key={s.id}><div className="story-card__body"><div className="eyebrow">{s.mode} · {s.status}</div><h3>{s.title}</h3><p><strong>Why explore:</strong> {s.premise}</p><p><small>Influence: {s.influences.map(id=>influences.find(x=>x.id===id)?.work||id).join(' · ')}</small></p><button className="secondary" onClick={()=>{setCreatorSeriesId(s.id);document.getElementById('series-detail')?.scrollIntoView({behavior:'smooth'})}}>Open series <ArrowRight size={16}/></button></div></article>)}</div><div id="series-detail" className="summary-panel"><div className="eyebrow">SERIES DEVELOPMENT · {current.status}</div><h2>{current.title}</h2><p>{current.premise}</p><p><strong>Situation:</strong> {current.situation}</p><p><strong>Recurring detail:</strong> {current.motif}</p><p><strong>Question:</strong> {current.question}</p><h3>Episode map</h3><ol>{current.episodes.map((ep,i)=><li key={i}>Episode {i+1}: {ep}</li>)}</ol><p><strong>Literary ingredients:</strong> {current.influences.map(id=>{const x=influences.find(y=>y.id===id);return x?x.work+' — '+x.ingredient+' ('+x.device+')':id}).join('; ')}. These are thematic influences, not plot adaptations.</p>{current.id==='one-stop'?<><h3>Complete pilot · Episode 1: {pilot.title}</h3>{pilot.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<h3>Channel treatments</h3><p><strong>YouTube:</strong> {pilot.youtube}</p><p><strong>Short-form:</strong> {pilot.short}</p><p><strong>Audio:</strong> {pilot.audio}</p></>:<p><strong>Draft status:</strong> Outline only. Complete prose and channel scripts still need to be developed and approved.</p>}<div className="part-navigation"><button className="secondary" onClick={()=>{navigator.clipboard?.writeText([current.title,current.premise,...current.episodes.map((e,i)=>'Episode '+(i+1)+': '+e)].join('\\n'))}}>Copy outline</button>{studioLedger.some(s=>s.id===current.id)&&<button className="secondary" onClick={()=>saveLedger(studioLedger.filter(s=>s.id!==current.id))}>Remove from ledger</button>}</div></div></section>}
    {studioTab==='inspiration'&&<section className="discover"><div className="section-head"><div><div className="eyebrow">GROWING REFERENCE LIBRARY</div><h2>Literary ingredients</h2></div></div><p>Reference works inform themes and devices; verify editions and rights before publishing any direct adaptation. Adding a reference does not automatically analyse its full text.</p><div className="story-grid">{influences.map(x=><article className="story-card" key={x.id}><div className="story-card__body"><h3>{x.work}</h3><p>{x.author}</p><p><strong>Theme:</strong> {x.ingredient}</p><p><strong>Device:</strong> {x.device}</p><small>{x.status}</small></div></article>)}</div><div className="summary-panel"><h3>Add a literary reference</h3><textarea aria-label="New literature reference" placeholder="Work — author — theme or narrative device" value={customInfluence} onChange={e=>setCustomInfluence(e.target.value)}/><button className="primary" disabled={!customInfluence.trim()} onClick={()=>{saveInfluences([...extraInfluences,{id:'custom-'+Date.now(),work:customInfluence.trim(),author:'To verify',ingredient:'To analyse',device:'To analyse',status:'User-added reference; not yet source-reviewed'}]);setCustomInfluence('')}}>Add reference</button></div></section>}
    {studioTab==='ledger'&&<section className="discover"><h2>Story Ledger</h2><p>Proposals generated in this browser are saved locally. Export them before switching devices or clearing browser data.</p><button className="secondary" onClick={()=>{const blob=new Blob([JSON.stringify({stories:studioLedger,inspirations:extraInfluences},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='kathakhoj-story-ledger.json';link.click();URL.revokeObjectURL(url)}}>Export ledger JSON</button><div className="story-grid">{catalogue.map(s=><article className="story-card" key={s.id}><div className="story-card__body"><h3>{s.title}</h3><p>{s.status} · {s.episodes.length} episodes</p><p><small>{s.id==='one-stop'?'Episode 1 prose drafted':'Episodes not yet written'}</small></p></div></article>)}</div></section>}
    </main></div>
  }

  if (showPreview) return <div className="app"><header className="topbar"><button className="brand brand--button" onClick={() => setShowPreview(false)}>Katha<span>Khoj</span></button><button className="ghost" onClick={() => setShowPreview(false)}><ArrowLeft size={18}/> Back to discover</button></header><main className="story-page"><section className="story-hero"><div><div className="eyebrow">{historicalSelection ? (historicalSelection.edition || historicalSelection.date) : 'HISTORICAL MALAYALAM SHORT STORY · 1893'}</div><h1>{historicalSelection ? historicalSelection.title : 'ദ್ವാരക · Dwaraka'}</h1><p className="story-subtitle">{historicalSelection ? historicalSelection.author : 'Vengayil Kunhiraman Nayanar'}</p><p>{historicalSelection ? 'Historical source text from Wikisource; original-language alignment is pending.' : 'Authentic historical fiction. The original Malayalam text is loaded from its Wikisource edition; the English translation is not yet available.'}</p><a href={historicalSelection ? 'https://' + (historicalSelection.sourceDomain || 'en.wikisource.org') + '/wiki/' + encodeURIComponent((historicalSelection.sourcePage + (historicalSelection.chaptered ? '/Chapter_' + sourceChapter : ''))).replaceAll('%2F','/') : "https://ml.wikisource.org/wiki/ദ്വാരക"} target="_blank" rel="noopener noreferrer">View displayed text and source edition ↗</a></div><div className="visual visual--green visual--hero"><div className="visual__glyph">{historicalSelection ? "ব" : "അ"}</div><div className="visual__region">{historicalSelection ? historicalSelection.language + ' literature · source text' : "Malayalam literature · original"}</div><div className="visual__caption">{historicalSelection ? 'PUBLISHED HISTORICAL TRANSLATION' : 'ORIGINAL WORK · 1893'}</div></div></section><div className="story-layout"><article className="reader"><section className="summary-panel"><div className="eyebrow">ABOUT THIS WORK</div><h2>{historicalSelection ? historicalSelection.title : 'ദ്വാരക'}</h2><p><strong>Author:</strong> {historicalSelection ? historicalSelection.author : 'Vengayil Kunhiraman Nayanar'} · <strong>Edition:</strong> {historicalSelection ? (historicalSelection.edition || historicalSelection.date) : '1893'} · <strong>Text displayed:</strong> {historicalSelection ? (historicalSelection.readerReady ? 'English translation of Bengali' : historicalSelection.language) : 'Malayalam original'}</p><p><strong>Source edition:</strong> {historicalSelection ? "English Wikisource · historical published translation" : "Malayalam Wikisource · English translation pending"}</p><p><strong>Translator:</strong> {historicalSelection ? (historicalSelection.translator || 'See source edition') : "English translation pending"}</p><div className="eyebrow">SUMMARY · SEPARATE FROM THE STORY</div><p>{historicalSelection ? (historicalSelection.description || historicalSelection.status) : 'A story connecting a telegraph engineer’s imagination with the legendary city of Dwaraka.'}</p></section><div className="part-reader"><div className="eyebrow">FULL SOURCE TEXT · READING SECTIONS</div><div className="part-navigation" role="group" aria-label="Reading language"><button className={readingLanguage === "original" ? "primary" : "secondary"} onClick={() => { setReadingLanguage("original"); setHistoricalPart(0) }}>Original · {historicalSelection ? "Bengali" : "Malayalam"}</button><button className={readingLanguage === "english" ? "primary" : "secondary"} onClick={() => { setReadingLanguage("english"); setHistoricalPart(0) }}>English</button></div><div className="eyebrow">{readingLanguage === "english" ? "English · published translation where available" : historicalSelection ? "Bengali · original pending" : "മലയാളം · original"}</div>{(historicalSelection && readingLanguage === 'original') || (!historicalSelection && readingLanguage === 'english') ? <div role="status" className="summary-panel"><h2>{readingLanguage === 'english' ? 'English translation not yet available' : 'Original Bengali text not yet available'}</h2><p>This language has not been sourced and verified for this work. The other language can be read using the switch above. No summary or machine-generated text is being presented as the complete story.</p></div> : historicalLoading ? <p>Loading the historical text…</p> : historicalError ? <p role="alert">{historicalError}</p> : <><h2>{historicalSelection?.chaptered ? 'Chapter ' + sourceChapter + ' of ' + historicalSelection.chapterCount + ' · ' : ''}Reading section {historicalPart + 1} of {Math.ceil(historicalText.length / 5)}</h2>{historicalText.slice(historicalPart * 5, historicalPart * 5 + 5).map((p,i) => <p lang={historicalSelection ? "en" : "ml"} key={i}>{p}</p>)}<div className="part-navigation"><button className="secondary" disabled={historicalPart === 0} onClick={() => setHistoricalPart(historicalPart - 1)}>Previous</button><button className="primary" disabled={(historicalPart + 1) * 5 >= historicalText.length} onClick={() => setHistoricalPart(historicalPart + 1)}>Next section <ArrowRight size={17}/></button></div>{historicalSelection?.chaptered && <div className="part-navigation"><button className="secondary" disabled={sourceChapter === 1 || historicalLoading} onClick={() => openHistorical(historicalSelection, sourceChapter - 1)}>Previous chapter</button><button className="primary" disabled={sourceChapter >= historicalSelection.chapterCount || historicalLoading} onClick={() => openHistorical(historicalSelection, sourceChapter + 1)}>{sourceChapter >= historicalSelection.chapterCount ? "End of story" : "Next chapter"} <ArrowRight size={17}/></button></div>}</>}</div></article><aside className="side-panel"><div className="side-card"><div className="eyebrow">ABOUT THE STORY</div><h3>{historicalSelection ? historicalSelection.title : 'ദ്വാരക · Dwaraka'}</h3><p><strong>Author:</strong> {historicalSelection ? historicalSelection.author : 'Vengayil Kunhiraman Nayanar'}</p><p><strong>Original language:</strong> {historicalSelection ? historicalSelection.language : 'Malayalam'}</p><p><strong>Edition:</strong> {historicalSelection ? (historicalSelection.edition || historicalSelection.date) : '1893'}</p><p><strong>Translator:</strong> {historicalSelection ? (historicalSelection.translator || 'Check source edition') : 'English translation pending'}</p><div className="eyebrow">ABOUT THE AUTHOR</div><p>{historicalSelection?.authorBio || (historicalSelection ? historicalSelection.author + ' · historical literary author. Biographical details require source validation.' : 'Vengayil Kunhiraman Nayanar · Malayalam prose author. Biographical details require source validation.')}</p><div className="eyebrow">SUMMARY</div><p>{historicalSelection ? (historicalSelection.description || historicalSelection.status || 'Summary awaiting source review.') : 'A historical Malayalam story associated with the legendary city of Dwaraka.'}</p><div className="eyebrow">LANGUAGES</div><p><strong>Original:</strong> {historicalSelection ? "Bengali · not yet available" : "Malayalam · source reader"}</p><p><strong>English:</strong> {historicalSelection ? "Published translation · source reader" : "Not yet available"}</p><div className="eyebrow">CHAPTERS / READING SECTIONS</div>{historicalSelection?.chaptered ? <div className="chapter-list">{Array.from({length: historicalSelection.chapterCount}, (_, i) => <button key={i} className={sourceChapter === i + 1 ? 'primary' : 'secondary'} disabled={historicalLoading} onClick={() => openHistorical(historicalSelection, i + 1)}>Chapter {i + 1}{sourceChapter === i + 1 ? ' · Current' : ''}</button>)}</div> : <div className="chapter-list">{Array.from({length: Math.ceil(historicalText.length / 5)}, (_, i) => <button key={i} className={historicalPart === i ? 'primary' : 'secondary'} onClick={() => setHistoricalPart(i)}>Reading section {i + 1}</button>)}</div>}<p className="muted">Reading sections are navigation divisions, not invented chapters. Original and English text are not interchangeable.</p></div></aside></div></main></div>

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
        <div style={{padding:'12px 28px',display:'flex',justifyContent:'flex-end'}}><button className="secondary" onClick={() => {setCreatorPage(true); window.scrollTo(0,0)}}><Sparkles size={17}/> Creator Studio · New story series</button></div>
        <section className="hero">
          <div className="hero__copy">
            <div className="eyebrow"><Sparkles size={15}/> REDISCOVER INDIA THROUGH ITS STORIES</div>
            <h1>Stories beyond<br/><em>the familiar.</em></h1>
            <p>Discover lesser-known Indian prose through concise introductions, author context and source-backed reading. Original-language texts and English translations are added as verified.</p>
            <div className="hero__actions">
              <button className="primary" onClick={() => document.getElementById('discover')?.scrollIntoView({behavior:'smooth'})}>Start discovering <ArrowRight size={18}/></button>
              <button className="secondary" onClick={() => { openHistorical() }}><BookOpen size={18}/> Read historical story</button>
            </div>
            <div className="format-strip">
              <span><BookOpen size={17}/> Regional literature</span>
              <span><Headphones size={17}/> Listen</span>
              <span><Clapperboard size={17}/> Watch</span>
            </div>
          </div>
          <div className="visual visual--green visual--hero"><div className="visual__glyph">✦</div><div className="visual__region">Stories across India</div><div className="visual__caption">DISCOVER · EXPLORE · READ</div></div>
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
            <p>Browse real works from multiple authors and languages. Each card shows whether its source text is available to read or still needs validation.</p>
          </div>

          <div className="controls" aria-label="Filter all discoveries"><div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search titles, authors, languages or themes…" /></div><div className="chips">{['All','Malayalam','Bengali','Odia','Assamese','Tamil','Telugu','Kannada','Hindi'].map(f => <button key={f} className={filter === f ? 'chip active' : 'chip'} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
          <div className="demo-heading"><div className="eyebrow">LESSER-KNOWN DISCOVERIES · ${validationCandidates.length + 1} WORKS</div><h3>Choose a story that catches your interest</h3><p>Real historical works across regional languages. Available source texts open in the reader; other works are clearly marked as awaiting source validation.</p></div>
          <div className="story-grid">
            {(filter === "All" || filter === "Malayalam") && ["ദ്വാരക","Dwaraka","Vengayil Kunhiraman Nayanar","Malayalam"].join(" ").toLowerCase().includes(query.toLowerCase()) && <article className="story-card"><div className="story-card__body"><div className="eyebrow">Malayalam · Historical short story</div><h3>ദ്വാരക · Dwaraka</h3><p><strong>Vengayil Kunhiraman Nayanar</strong> · 1893</p><p><strong>Why explore:</strong> An early Malayalam prose work that offers a glimpse into the beginnings of modern storytelling in the language.</p><div className="candidate-tags"><span>Original Malayalam · source reader</span><span>English pending</span></div><div className="story-card__footer"><span>Source text</span><button onClick={() => openHistorical()}>Explore story <ArrowRight size={17}/></button></div></div></article>}
            {validationCandidates.filter(item => (filter === "All" || item.language === filter) && [item.title,item.author,item.language,item.kind,item.hook,item.status].join(" ").toLowerCase().includes(query.toLowerCase())).map(item => <article className="story-card" key={item.id}><div className="story-card__body"><div className="eyebrow">{item.language} · {item.kind}</div><h3>{item.title}</h3><p><strong>{item.author}</strong> · {item.date}</p><p><strong>Why explore:</strong> {item.hook || 'Discover this work and its place in regional literary history; a story-specific introduction is awaiting validation.'}</p><div className="candidate-tags"><span>{item.readerReady ? 'Source reader · verify chapters' : 'Source validation pending'}</span></div><p className="muted">{item.status}</p><div className="story-card__footer"><span>{item.readerReady ? 'Historical English text' : 'Discovery only'}</span>{item.readerReady ? <button onClick={() => openHistorical(item)}>Explore story <ArrowRight size={17}/></button> : <span>Reader pending</span>}</div></div></article>)}
          </div>
          <div className="demo-heading"><div className="eyebrow">CLASSICS · ${historicalSelections.length} STORIES</div><h3>Explore established literary classics</h3><p>A separate shelf for widely recognised authors. These works are not part of the lesser-known discovery collection.</p></div><div className="story-grid">
            {historicalSelections.filter(item => (filter === "All" || filter === "Bengali") && [item.title,item.author,item.language,item.description].join(" ").toLowerCase().includes(query.toLowerCase())).map(item => <article className="story-card" key={item.id}><div className="story-card__body"><div className="eyebrow">Bengali · Historical English translation</div><h3>{item.title}</h3><p><strong>{item.author}</strong> · {item.edition}</p><p><strong>Why explore:</strong> {item.description}</p><div className="candidate-tags"><span>Source text · verify edition</span></div><div className="story-card__footer"><span>English text</span><button onClick={() => openHistorical(item)}>Explore story <ArrowRight size={17}/></button></div></div></article>)}
          </div>
          <div className="demo-heading"><div className="eyebrow">EDITORIAL SAMPLES</div><h3>Prototype fiction · separate from historical works</h3><p>These are KathaKhoj demonstration stories, not historical regional literature. The Blue Door has Kannada and English text; the other samples are English-only.</p></div>
          <div className="story-grid">
            {filtered.filter(story => (filter === "All" || story.region === filter) && [story.title,story.subtitle,story.region,story.theme].join(" ").toLowerCase().includes(query.toLowerCase())).map(story => (
              <article className="story-card" key={story.id}>
                <button className="card-save" aria-label="Save story" onClick={() => toggleSaved(story.id)}>
                  {saved.includes(story.id) ? <BookmarkCheck size={18}/> : <Bookmark size={18}/>}
                </button>
                <Visual story={story} />
                <div className="story-card__body">
                  <div className="eyebrow">{story.region} · {story.originalLanguage === 'English' ? 'ENGLISH-ONLY DEMO' : 'KANNADA + ENGLISH · COMPLETE'} · {story.theme}</div>
                  <h3>{story.title}</h3>
                  <p><strong>Why explore:</strong> {typeof story.summary === 'string' ? story.summary : story.summary.english}</p>
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
