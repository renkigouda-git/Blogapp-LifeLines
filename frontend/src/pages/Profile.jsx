import React from 'react'
import { useAuth } from '../hooks/useAuth'
import BackButton from '../components/BackButton'   // ✅ Added

export default function Profile(){
  const {user} = useAuth()

  return (
    <div className="container">

      {/* ✅ BACK BUTTON HERE */}
      <BackButton />

      <h2>Your profile</h2>
      <div className="card">
        <div>Name: <b>{user?.name}</b></div>
        <div>Email: <b>{user?.email}</b></div>
        <div>Role: <b>{user?.role || 'USER'}</b></div>
      </div>
    </div>
  )
}
