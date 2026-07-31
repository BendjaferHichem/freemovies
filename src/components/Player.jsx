import React from 'react'
import styles from './Player.module.css'

export default function Player({
  src,           // Optional: Direct custom src if passed
  id,            // IMDb or TMDB ID
  type = 'movie',// 'movie' or 'tv'
  season = 1,    // Season number for TV shows
  episode = 1,   // Episode number for TV shows
  autoPlay = true,
  theme,         // e.g. "16A085" (Hex without #)
  sub,           // e.g. "en"
  title,
  year,
  rating,
  overview,
  badge,
  onClose
}) {
  // 1. Build the VidCore iframe URL if no direct `src` was provided
  let playerSrc = src

  if (!playerSrc && id) {
    // Construct base path according to VidCore docs
    const basePath = type === 'tv' 
      ? `https://vidcore.net/tv/${id}/${season}/${episode}`
      : `https://vidcore.net/movie/${id}`

    // Build optional query parameters
    const params = new URLSearchParams()
    if (autoPlay) params.append('autoPlay', 'true')
    if (theme) params.append('theme', theme.replace('#', '')) // Strip '#' if passed
    if (sub) params.append('sub', sub)
    
    // TV show specific options
    if (type === 'tv') {
      params.append('nextButton', 'true')
      params.append('autoNext', 'true')
    }

    const queryString = params.toString()
    playerSrc = queryString ? `${basePath}?${queryString}` : basePath
  }

  // If there's no src or id available, return null
  if (!playerSrc) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.meta}>
        <div className={styles.metaTop}>
          <h2 className={styles.title}>{title}</h2>
          {onClose && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close player">✕</button>
          )}
        </div>
        <div className={styles.pills}>
          {year && <span className={styles.pill}>{year}</span>}
          {rating && <span className={`${styles.pill} ${styles.gold}`}>★ {rating}</span>}
          {badge && <span className={`${styles.pill} ${styles.badge}`}>{badge}</span>}
        </div>
        {overview && <p className={styles.overview}>{overview}</p>}
      </div>
      <div className={styles.playerBox}>
        <iframe
          src={playerSrc}
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          title={title || "Video Player"}
        />
      </div>
    </div>
  )
}
