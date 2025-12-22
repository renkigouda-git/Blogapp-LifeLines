// src/pages/Topics.jsx
// src/pages/Topics.jsx
import React from 'react'

const TOPICS = [
  {
    key:'tech', title:'Tech', 
    href:'https://dev.to/t/technology',
    img:'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop'
  },
  {
    key:'ai', title:'AI', 
    href:'https://dev.to/t/ai',
    img:'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1600&auto=format&fit=crop'
  },
  {
    key:'photography', title:'Photography', 
    href:'https://www.digitalphotomentor.com/beginner-photography/',
    img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop'
  },
  {
    key:'travel', title:'Travel', 
    href:'https://www.lonelyplanet.com/',
    img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'
  },
  {
    key:'lifestyle', title:'Lifestyle', 
    href:'https://medium.com/tag/lifestyle',
    img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop'
  },
  {
    key:'finance', title:'Finance', 
    href:'https://www.investopedia.com/finance-4689743',
    img:'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1600&auto=format&fit=crop'
  },
  {
    key:'health', title:'Health', 
    href:'https://www.who.int/health-topics',
    img: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=800&q=60"
  },
  {
    key:'education', title:'Education', 
    href:'https://www.freecodecamp.org/news/',
    img:'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop'
  },
  {
    key:'programming', title:'Programming', 
    href:'https://developer.mozilla.org/',
    img:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop'
  }
]

export default function Topics(){
  return (
    <div className="container page">
      <h2>Topics</h2>
      <p className="sub">Explore categories people love reading about.</p>

      <div className="topic-grid">
        {TOPICS.map(t => (
          <a key={t.key} href={t.href} target="_blank" rel="noreferrer noopener" className="topic-card card hover">
            <img className="cover" src={t.img} alt={t.title}/>
            <div className="card-body">
              <h3 className="card-title">{t.title}</h3>
              <span className="pill">Explore →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
