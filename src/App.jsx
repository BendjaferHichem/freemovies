import React, { useState, useEffect } from 'react'
import Movies from './pages/Movies.jsx'
import TV from './pages/TV.jsx'
import styles from './App.module.css'

function clearMovieSession() {
  ['mv_query', 'mv_player'].forEach(k => sessionStorage.removeItem(k))
}

export default function App() {
  const [tab, setTab] = useState(() => sessionStorage.getItem('cs_tab') || 'movies')
  const [homeKey, setHomeKey] = useState(0)

  // 1. Theme State Initialization
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) return savedTheme
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark' // Default fall-back
  })

  // 2. Sync Theme with HTML Attribute & LocalStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // 3. Theme Toggle Handler
  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  function goTab(t) {
    setTab(t)
    sessionStorage.setItem('cs_tab', t)
  }

  function goHome() {
    clearMovieSession()
    setTab('movies')
    sessionStorage.setItem('cs_tab', 'movies')
    setHomeKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isDark = theme === 'dark'

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <button className={styles.logo} onClick={goHome} aria-label="Go to home">
          <span className={styles.logoAccent}>BENJ</span><span className={styles.logoDot}>·</span>MOVIE
        </button>

        {/* Navigation Tabs */}
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'movies' ? styles.active : ''}`}
            onClick={() => goTab('movies')}
          >
            Movies
          </button>
          <button
            className={`${styles.tab} ${tab === 'tv' ? styles.active : ''}`}
            onClick={() => goTab('tv')}
          >
            TV Series
          </button>
        </nav>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark/light mode"
          className={styles.themeToggleBtn}
        >
          <span>{isDark ? '☀️' : '🌙'}</span>
          <span className={styles.toggleLabel}>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </header>

      <main className={styles.main}>
        {tab === 'movies'
          ? <Movies key={homeKey} />
          : <TV />
        }
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()} All rights reserved{' '}
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            HichemBenj
          </a>
          {' '}| free movies/tvShows
        </p>
      </footer>
    </div>
  )
}
