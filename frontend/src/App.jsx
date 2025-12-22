// src/App.jsx
import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import VerifyBanner from './components/VerifyBanner.jsx'   // ⭐ NEW
import { useAuth } from './hooks/useAuth.jsx'

// Existing pages (eager)
import Home from './pages/Home.jsx'
import Posts from './pages/Posts.jsx'
import PostDetail from './pages/PostDetail.jsx'
import NewPost from './pages/NewPost.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import About from './pages/About.jsx'
import Profile from './pages/Profile.jsx'          // /me (private)
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'
import EditPost from './pages/EditPost.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResendVerification from './pages/ResendVerification.jsx'
import Magazine from './pages/Magazine.jsx'
import SeriesForm from './pages/admin/SeriesForm'
import TagForm from './pages/admin/TagForm'

// 👉 NEW admin sub-pages (eager import, small files)
import UsersAdmin from './pages/admin/UsersAdmin.jsx'
import Moderation from './pages/admin/Moderation.jsx'
import FeatureSlots from './pages/admin/FeatureSlots.jsx'

// 👉 NEW: analytics helpers + page
import { recordPageView } from './utils/analytics.js'
import Analytics from './pages/Analytics.jsx'
import Verify from "./pages/Verify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// NEW pages (lazy to keep bundle small)
const Browse         = lazy(()=>import('./pages/Browse.jsx'))
const Topics         = lazy(()=>import('./pages/Topics.jsx'))
const TopicView      = lazy(()=>import('./pages/TopicView.jsx'))
const Bookmarks      = lazy(()=>import('./pages/Bookmarks.jsx'))
const PublicProfile  = lazy(()=>import('./pages/PublicProfile.jsx')) // /u/:username
const Settings       = lazy(()=>import('./pages/Settings.jsx'))
const Notifications  = lazy(()=>import('./pages/Notifications.jsx'))
const Series         = lazy(()=>import('./pages/Series.jsx'))
const SeriesDetail   = lazy(()=>import('./pages/SeriesDetail.jsx'))
const Tags           = lazy(()=>import('./pages/Tags.jsx'))
const TagView        = lazy(()=>import('./pages/TagView.jsx'))
const SearchPage     = lazy(()=>import('./pages/Search.jsx'))
const Contact        = lazy(()=>import('./pages/Contact.jsx'))

// 🔍 Analytics listener – logs every route change to localStorage
function AnalyticsListener() {
  const location = useLocation()

  useEffect(() => {
    recordPageView(location.pathname)
  }, [location.pathname])

  return null
}

function Protected({ children }){
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App(){
  const { user } = useAuth();   // ⭐ to show banner

  return (
    <>
      {/* invisible analytics tracker */}
      <AnalyticsListener />

      <Navbar />
      {/* ⭐ NEW: verification banner for logged-in but unverified users */}
      <VerifyBanner user={user} />

      <Suspense fallback={<div className="container" style={{padding:'1rem'}}>Loading…</div>}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home/>} />
          <Route path="/posts" element={<Posts/>} />
          <Route path="/posts/:id" element={<PostDetail/>} />
          <Route path="/magazine" element={<Magazine/>} />
          <Route path="/about" element={<About/>} />

          {/* New public sections */}
          <Route path="/browse" element={<Browse/>} />
          <Route path="/topics" element={<Topics/>} />
          <Route path="/topics/:slug" element={<TopicView/>} />
          <Route path="/series" element={<Series/>} />
          <Route path="/series/:slug" element={<SeriesDetail/>} />
          <Route path="/tags" element={<Tags/>} />
          <Route path="/tag/:slug" element={<TagView/>} />
          <Route path="/search" element={<SearchPage/>} />
          <Route path="/u/:username" element={<PublicProfile/>} />
          <Route path="/contact" element={<Contact/>} />
           
          {/* Auth */}
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/resend-verification" element={<ResendVerification/>} />

          {/* Private */}
          <Route path="/posts/:id/edit" element={<Protected><EditPost/></Protected>} />
          <Route path="/posts/new" element={<Protected><NewPost/></Protected>} />
          <Route path="/me" element={<Protected><Profile/></Protected>} />
          <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
          <Route path="/bookmarks" element={<Protected><Bookmarks/></Protected>} />
          <Route path="/settings" element={<Protected><Settings/></Protected>} />
          <Route path="/notifications" element={<Protected><Notifications/></Protected>} />
          <Route path="/admin/series/new" element={<Protected><SeriesForm /></Protected>} />
          <Route path="/admin/tags/new" element={<Protected><TagForm /></Protected>} />

          {/* Admin */}
          <Route path="/admin" element={<Protected><Admin/></Protected>} />
          <Route path="/admin/users" element={<Protected><UsersAdmin/></Protected>} />
          <Route path="/admin/moderation" element={<Protected><Moderation/></Protected>} />
          <Route path="/admin/features" element={<Protected><FeatureSlots/></Protected>} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/reset/:token" element={<ResetPassword />} />

          {/* Analytics (private, same protection as dashboard) */}
          <Route path="/analytics" element={<Protected><Analytics/></Protected>} />
        </Routes>
      </Suspense>

      <footer>
        <div className="container flex space-between">
          <div>BlogApp • built for your voice</div>
          <nav className="nav">
            <Link className="link" to="/about">About</Link>
            <span style={{opacity:.4, margin:'0 .6rem'}}>•</span>
            <Link className="link" to="/contact">Contact</Link>
            <span style={{opacity:.4, margin:'0 .6rem'}}>•</span>
            {/* 👉 NEW: Analytics button for logged-in users/admins (route is protected) */}
            <Link className="link" to="/analytics">Analytics</Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
