// src/components/Navbar.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import SideMenu from './SideMenu';
import { fetchUnreadCount, NOTIF_EVENT } from '../utils/notificationsApi.js';

function initials(name = '') {
  const parts = String(name).trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'U';
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme, THEMES } = useTheme();
  const nav = useNavigate();

  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🔔 unread notifications
  const [unread, setUnread] = useState(0);

  const themeItems = useMemo(() => {
    if (!Array.isArray(THEMES)) return [];
    if (typeof THEMES[0] === 'string') return THEMES.map(k => ({ key: k, label: k }));
    return THEMES.map(t => ({ key: t.key, label: t.label ?? t.key }));
  }, [THEMES]);

  // Close theme dropdown when clicking outside / ESC
  useEffect(() => {
    if (!themeOpen) return;
    const onDocClick = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setThemeOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [themeOpen]);

  // 🔔 Load initial count + subscribe to notification change events
  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const n = await fetchUnreadCount();
        if (!cancelled) {
          console.log('[navbar] initial unread =', n);
          setUnread(n || 0);
        }
      } catch (e) {
        console.error('[navbar] fetchUnreadCount failed', e);
      }
    };

    load(); // initial

    const handler = (e) => {
      if (cancelled) return;
      const detail = e.detail || {};
      console.log('[navbar] notif event detail =', detail);
      if (typeof detail.unread === 'number') {
        setUnread(detail.unread);
      } else {
        // fallback: if some caller forgot to send count, re-fetch
        load();
      }
    };

    window.addEventListener(NOTIF_EVENT, handler);

    return () => {
      cancelled = true;
      window.removeEventListener(NOTIF_EVENT, handler);
    };
  }, [user]);

  const topTabs = [
    { to: '/', label: 'Home' },
    { to: '/posts', label: 'Posts' },
    { to: '/about', label: 'About' },
  ];
  if (user) topTabs.splice(2, 0, { to: '/dashboard', label: 'Dashboard' });

  return (
    <>
      <header className="topbar glass-nav fade-item">
        <div
          className="container nav-header"
          style={{ display: 'flex', alignItems: 'center', gap: '.6rem', justifyContent: 'space-between' }}
        >
          {/* Left: menu + brand */}
          <div className="flex" style={{ gap: '.6rem', alignItems: 'center' }}>
            <button
              className="hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              title="Menu"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </button>

            <nav className="nav brand-side">
              <NavLink
                className={({ isActive }) =>
                  'brand brand-lifelines ' + (isActive ? 'active-nav' : '')
                }
                to="/"
              >
                ✨ LIFELINES
              </NavLink>
            </nav>
          </div>

          {/* Center tabs */}
          <nav className="nav nav-tabs-wrap" style={{ flexWrap: 'wrap' }}>
            {topTabs.map(t => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) => 'nav-tab ' + (isActive ? 'active-nav' : '')}
              >
                {t.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <nav className="nav right-side" style={{ alignItems: 'center', gap: '0.6rem' }}>
            {/* Theme picker */}
            <div className="theme-menu" ref={themeRef} style={{ position: 'relative' }}>
              <button
                className="theme-toggle btn btn-ghost"
                onClick={() => setThemeOpen(v => !v)}
              >
                Theme: {theme} ▾
              </button>
              {themeOpen && (
                <div
                  className="theme-list card"
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    padding: '.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.25rem',
                    minWidth: 160,
                    zIndex: 1000,
                  }}
                >
                  {themeItems.map(t => (
                    <button
                      key={t.key}
                      className="btn btn-ghost"
                      style={{ textAlign: 'left' }}
                      onClick={() => {
                        setTheme(t.key);
                        setThemeOpen(false);
                      }}
                    >
                      {t.label}
                      {t.key === theme ? ' ✓' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => nav('/posts/new')}
                >
                  New Post
                </button>

                <span className="badge user-greet">
                  <span className="avatar">{initials(user.name)}</span> Hi,{` `}
                  {user.name.split(' ')[0]}
                </span>

                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    logout();
                    nav('/');
                  }}
                >
                  Logout
                </button>

                {/* 🔔 bell AFTER Logout */}
                <Link
                  to="/notifications"
                  className="btn btn-ghost"
                  style={{ position: 'relative', paddingInline: '0.9rem' }}
                  aria-label="Notifications"
                >
                  <span role="img" aria-hidden="true" style={{ fontSize: '1.1rem' }}>
                    🔔
                  </span>
                  {unread > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 6,
                        minWidth: 16,
                        height: 16,
                        borderRadius: 999,
                        background: 'var(--primary)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px',
                      }}
                    >
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-ghost" to="/login">
                  Login
                </Link>
                <Link className="btn btn-accent" to="/register">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <SideMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
