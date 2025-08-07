import React, { useEffect, useState } from 'react'
import SpaceBackground from './components/SpaceBackground.jsx'

const sections = [
  { id: 'home', label: 'Početna' },
  { id: 'about', label: 'O meni' },
  { id: 'skills', label: 'Veštine' },
  { id: 'projects', label: 'Projekti' },
  { id: 'contact', label: 'Kontakt' },
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
      <nav className="navbar">
        {sections.map(s => (
          <a key={s.id} onClick={() => go(s.id)} className={active===s.id ? 'active' : ''} role="button">{s.label}</a>
        ))}
      </nav>

      <section id="home" className="section">
        <div className="container hero">
          <div>
            <div className="badge">ETF Beograd · Signals & Systems / ML</div>
            <h1 className="title">Zdravo, ja sam Pavle</h1>
            <p className="subtitle">Radim na obradi signala, estimaciji i mašinskom učenju. Gradim čiste modele i jasne vizualizacije.</p>
            <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:16}}>
              <a className="button" onClick={() => go('projects')}>Pogledaj projekte</a>
              <a className="button" onClick={() => go('about')}>Više o meni</a>
              <a className="button" href="#" download>Preuzmi CV</a>
            </div>
          </div>
          <div className="card">
            <div className="small">Demo</div>
            <h3 style={{margin:'6px 0 10px'}}>Live signal · sin + šum</h3>
            <canvas id="demo-canvas" width="640" height="360" style={{width:'100%', height:'auto', borderRadius:12, background:'rgba(255,255,255,0.04)'}}></canvas>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container card">
          <h2 className="title" style={{fontSize:32}}>O meni</h2>
          <p className="subtitle">Treća godina, smer Signali i sistemi (ETF). Zanimaju me DSP, statistička estimacija i neuronske mreže.</p>
          <p className="small">Cilj: master u inostranstvu (AI/ML). Trudim se da povezujem teoriju sa praktičnim projektima (Python / MATLAB).</p>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="container">
          <h2 className="title" style={{fontSize:32}}>Veštine</h2>
          <div className="grid grid3">
            {[
              ['Python / PyTorch','Modeli, treninzi, vizualizacije'],
              ['MATLAB / DSP','Filtri, FFT, simulacije sistema'],
              ['MLE / BLUE / Bayes','Teorija estimacije, CRLB'],
              ['SQL & Baze','Modelovanje, upiti, optimizacija'],
              ['Web (React + 3D)','Interaktivne prezentacije i dashboardi'],
              ['Engleski (TOEFL)','Akademsko pisanje i prezentacije'],
            ].map(([t,d]) => (
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
          <h2 className="title" style={{fontSize:32}}>Izdvojeni projekti</h2>
          <div className="grid grid3">
            {[1,2,3].map(i => (
              <div key={i} className="card">
                <div className="small">Projekt {i}</div>
                <div style={{height:160, borderRadius:12, background:'rgba(255,255,255,0.06)', marginTop:10, display:'grid', placeItems:'center'}}>Slika / GIF</div>
                <p className="small" style={{marginTop:10}}>Kratak opis: metode, rezultati, link ka GitHub repozitorijumu.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container card">
          <h2 className="title" style={{fontSize:32}}>Kontakt</h2>
          <form className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}} onSubmit={(e)=>e.preventDefault()}>
            <input placeholder="Ime" className="card" style={{outline:'none'}}/>
            <input placeholder="E-mail" className="card" style={{outline:'none'}}/>
            <textarea placeholder="Poruka" className="card" style={{gridColumn:'1 / span 2', minHeight:120, outline:'none'}}/>
            <div><button className="button" type="submit">Pošalji</button></div>
          </form>
          <div className="small" style={{marginTop:8}}>*Forma je demo – mogu da dodam backend (Email/API) po želji.</div>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Pavle • ETF Beograd • Signals & Systems / ML
      </footer>
    </>
  )
}
