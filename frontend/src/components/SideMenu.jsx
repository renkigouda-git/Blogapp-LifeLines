// src/components/SideMenu.jsx
import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function SideMenu({ open, onClose }) {
  const { user, logout } = useAuth()

  return (
    <aside
      className={`side-menu ${open ? 'open' : ''}`}
      aria-hidden={!open}
      onClick={(e) => { if (e.target.classList.contains('side-menu')) onClose?.() }}
    >
      <div className="side-panel" role="dialog" aria-label="Main menu">
        <div className="side-head">
          <Link to="/" className="brand brand-lifelines" onClick={onClose}>✨ LIFELINES</Link>
          <button className="btn btn-ghost close-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <nav className="side-nav">
          {/* Topbar items are also here for convenience */}
          <NavLink onClick={onClose} to="/" end>Home</NavLink>
          <NavLink onClick={onClose} to="/posts">Posts</NavLink>
          {user && <NavLink onClick={onClose} to="/dashboard">Dashboard</NavLink>}
          <NavLink onClick={onClose} to="/about">About</NavLink>

          {/* The rest live primarily in the side menu */}
          <NavLink onClick={onClose} to="/magazine">Magazine</NavLink>
          <NavLink onClick={onClose} to="/browse">Browse</NavLink>
          <NavLink onClick={onClose} to="/topics">Topics</NavLink>
          <NavLink onClick={onClose} to="/bookmarks">Bookmarks</NavLink>
          <NavLink onClick={onClose} to="/settings">Settings</NavLink>

          {/* NEW: you asked to add these */}
          <NavLink onClick={onClose} to="/series">Series</NavLink>
          <NavLink onClick={onClose} to="/tags">Tags</NavLink>
          <NavLink onClick={onClose} to="/contact">Contact</NavLink>

          {user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') && (
            <NavLink onClick={onClose} to="/admin">Admin</NavLink>
          )}
        </nav>

        <div className="side-footer">
          {user ? (
            <>
              <Link className="btn btn-primary" to="/posts/new" onClick={onClose}>New Post</Link>
              <button className="btn btn-ghost" onClick={() => { logout(); onClose?.() }}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login" onClick={onClose}>Login</Link>
              <Link className="btn btn-primary" to="/register" onClick={onClose}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
