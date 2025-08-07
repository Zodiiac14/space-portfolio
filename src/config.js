export const SITE = {
  name: "Pavle · Portfolio",
  tagline: "Signals & Systems · Machine Learning · DSP",
  hero: {
    title: "Hi, I'm Pavle.",
    subtitle: "I work on signal processing, statistical estimation and machine learning. I build clean models and clear visualizations.",
    buttons: [
      { label: "View Projects", to: "projects" },
      { label: "About Me", to: "about" },
      { label: "Download CV", href: "#", download: true }
    ]
  },
  about: {
    title: "About Me",
    subtitle: "3rd-year EE student (Signals & Systems). I’m into DSP, estimation theory and neural networks.",
    body: "Goal: Master's abroad (AI/ML). I aim to connect strong theory with practical projects (Python / MATLAB / PyTorch)."
  },
  skills: [
    ["Python / PyTorch","Models, training, visualizations"],
    ["MATLAB / DSP","Filters, FFT, system simulations"],
    ["MLE / BLUE / Bayes","Estimation theory, CRLB"],
    ["SQL & Databases","Schema design, queries, optimization"],
    ["Web (React + 3D)","Interactive presentations & dashboards"],
    ["English (TOEFL)","Academic writing & presentations"]
  ],
  projectsTitle: "Featured Projects",
  contactTitle: "Contact",
  footer: "© " + new Date().getFullYear() + " Pavle • University of Belgrade (ETF) • Signals & Systems / ML"
}

export const LINKS = {
  github: "https://github.com/",
  linkedin: "https://linkedin.com/",
  email: "mailto:you@example.com"
}

export const ELEMENTS = [
  { key: "fire",   label: "Fire",  color: "#ef4444", desc: "Energy. Drive. Initiative." },
  { key: "water",  label: "Water", color: "#22d3ee", desc: "Adaptability. Flow state." },
  { key: "air",    label: "Air",   color: "#93c5fd", desc: "Clarity. Communication." },
  { key: "earth",  label: "Earth", color: "#22c55e", desc: "Grounding. Reliability." },
  { key: "data",   label: "Data",  color: "#a78bfa", desc: "Intelligence. Insight. Future." }
]
