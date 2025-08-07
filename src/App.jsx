import React, { useEffect, useState } from 'react'
import SpaceBackground from './components/SpaceBackground.jsx'
import { SITE, LINKS, ELEMENTS } from './config.js'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function App(){
  const [active, setActive] = useState('home')

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id)
      })
    }, { rootMargin: '-40% 0px -55% 0px' })
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <SpaceBackground/>

      {/* Elements quick legend */}
      <div className="elements-bar">
        {ELEMENTS.map(el => (
          <div key={el.key} className="element-pill" title={el.desc}>
            <span className="element-dot" style={{background: el.color}}></span>
            {el.label}
          </div>
        ))}
      </div>

      <nav className="navbar">
        {sections.map(s => (
          <a key={s.id} onClick={() => go(s.id)} className={active===s.id ? 'active' : ''} role="button">{s.label}</a>
        ))}
      </nav>

      <section id="home" className="section">
        <div className="container hero">
          <div>
            <div className="badge">{SITE.tagline}</div>
            <h1 className="title">{SITE.hero.title}</h1>
            <p className="subtitle">{SITE.hero.subtitle}</p>
            <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:16}}>
              {SITE.hero.buttons.map((b, i) => (
                b.href
                  ? <a className="button" key={i} href={b.href} {...(b.download?{download:true}:{})}>{b.label}</a>
                  : <a className="button" key={i} onClick={() => go(b.to)}>{b.label}</a>
              ))}
            </div>
            <div style={{marginTop:18}} className="small">
              I believe in five core elements. Four shape our world. One shapes the future: Fire · Water · Air · Earth · Data.
            </div>
          </div>
          <div className="card">
            <div className="small">DSP Demo</div>
            <h3 style={{margin:'6px 0 10px'}}>Live Signal · sin + noise</h3>
            <canvas id="demo-canvas" width="640" height="360" style={{width:'100%', height:'auto', borderRadius:12, background:'rgba(255,255,255,0.04)'}}></canvas>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container card">
          <h2 className="title" style={{fontSize:32}}>{SITE.about.title}</h2>
          <p className="subtitle">{SITE.about.subtitle}</p>
          <p className="small">{SITE.about.body}</p>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="container">
          <h2 className="title" style={{fontSize:32}}>Skills</h2>
          <div className="grid grid3">
            {SITE.skills.map(([t,d]) => (
              <div key={t} className="card">
                <div className="small">{t}</div>
                <div style={{fontWeight:700, marginTop:8}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <h2 className="title" style={{fontSize:32}}>{SITE.projectsTitle}</h2>
          <div className="grid grid3">
            {[1,2,3].map(i => (
              <div key={i} className="card">
                <div className="small">Project {i}</div>
                <div style={{height:160, borderRadius:12, background:'rgba(255,255,255,0.06)', marginTop:10, display:'grid', placeItems:'center'}}>Image / GIF</div>
                <p className="small" style={{marginTop:10}}>Short description: methods, results, and link to the GitHub repository.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container card">
          <h2 className="title" style={{fontSize:32}}>{SITE.contactTitle}</h2>
          <form className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}} onSubmit={(e)=>e.preventDefault()}>
            <input placeholder="Name" className="card" style={{outline:'none'}}/>
            <input placeholder="E-mail" className="card" style={{outline:'none'}}/>
            <textarea placeholder="Message" className="card" style={{gridColumn:'1 / span 2', minHeight:120, outline:'none'}}/>
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <button className="button" type="submit">Send</button>
              <a className="button" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="button" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="button" href={LINKS.email}>E-mail</a>
            </div>
          </form>
          <div className="small" style={{marginTop:8}}>*Form is a demo – I can hook up Email/API on request.</div>
        </div>
      </section>

      <footer className="footer">
        {SITE.footer}
      </footer>
    </>
  )
}
