import React from 'react'
import { Link } from 'react-router-dom'

/**
 * MagazineHero
 * - Big “cover” story on the left
 * - Two spotlight cards on the right
 * - If a post has NO coverImageUrl we render a clean text-only panel
 */
export default function MagazineHero({ main, side }) {
  if (!main) return null
  const safeSide = Array.isArray(side) ? side.slice(0, 2) : []

  const excerpt = (main.content || '').slice(0, 140) +
    ((main.content || '').length > 140 ? '…' : '')

  return (
    <section className="mag-hero">
      {/* Cover story */}
      <Link to={`/posts/${main.id}`} className="big-story">
        {main.coverImageUrl ? (
          <img src={main.coverImageUrl} alt={main.title} className="big-img" />
        ) : (
          <div className="big-img big-img--placeholder" />
        )}

        <div className="overlay">
          <div className="overlay-kicker">Cover story</div>
          <h1 className="overlay-title">{main.title}</h1>
          {excerpt && <p className="overlay-excerpt">{excerpt}</p>}
        </div>
      </Link>

      {/* Side spotlights */}
      <div className="side-stories">
        {safeSide.map(s => {
          const noImg = !s.coverImageUrl
          return (
            <Link to={`/posts/${s.id}`} key={s.id} className={`side-card${noImg ? ' noimg' : ''}`}>
              {noImg ? (
                <div className="side-card__body">
                  <div className="side-card__kicker">Spotlight</div>
                  <h3>{s.title}</h3>
                  {!!s.content && (
                    <p className="small" style={{ marginTop: '.25rem' }}>
                      {(s.content || '').slice(0, 110)}
                      {(s.content || '').length > 110 ? '…' : ''}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <img src={s.coverImageUrl} alt={s.title} />
                  <div className="side-card__body">
                    <div className="side-card__kicker">Spotlight</div>
                    <h3>{s.title}</h3>
                  </div>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
