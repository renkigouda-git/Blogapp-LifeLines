import React from 'react'
import Seo from '../components/Seo.jsx'

export default function About(){
  return (
    <div className="container page about">
      <Seo
        title="About"
        description="Learn what BlogApp is about — a calm, creative space where you can write what you feel and connect with others."
      />

      <h1>About BlogApp ✨</h1>

      <p>
        BlogApp is a calm, creative space where you can write what you feel,
        share what you know, and connect with people who resonate with your thoughts.
        No ads. No distractions. Just your ideas flowing.
      </p>

      <h2>Why BlogApp?</h2>
      <ul className="bullet">
        <li>✍️ Express freely — your voice matters</li>
        <li>🖼️ Add images, stories, ideas, experiences</li>
        <li>❤️ Build community with comments & reactions</li>
        <li>🎨 Switch themes and make your space yours</li>
      </ul>

      <h2>Community Guidelines (Rules) 📜</h2>
      <p className="small">
        These simple rules keep BlogApp welcoming and fun for everyone. Breaking them may lead to post removal or account limits.
      </p>
      <ul className="bullet">
        <li><b>Be kind.</b> No harassment, hate speech, or bullying.</li>
        <li><b>Stay constructive.</b> Critique ideas, not people.</li>
        <li><b>Keep it yours.</b> Post only content you created or have rights to share.</li>
        <li><b>Safe for work.</b> Don’t post illegal or explicit content.</li>
        <li><b>No spam.</b> Don’t flood or aggressively advertise.</li>
        <li><b>Respect privacy.</b> Don’t share private info without consent.</li>
        <li><b>Report issues.</b> If you see abuse, report it so we can help.</li>
      </ul>

      <h2>Tips for great posts 🌟</h2>
      <ul className="bullet">
        <li>Use a clear title and a helpful cover image.</li>
        <li>Write in short paragraphs; add headings for long posts.</li>
        <li>Be honest and human — your voice is your superpower.</li>
        <li>Tag ideas inline with <code>#keywords</code> to help others find your post.</li>
      </ul>

      <blockquote>
        “Every story you write becomes a light for someone else.”
      </blockquote>

      <p>
        Thank you for being here. We can’t wait to read what you create.
      </p>
    </div>
  )
}
