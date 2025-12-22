import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }){
  // keep user in localStorage, but only valid when a token exists
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    try { return raw ? JSON.parse(raw) : null } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(()=>{
    // keep storage in sync and guard with token
    if (token && user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
      if (!token) setUser(null)
    }
  }, [user, token])

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    if (data?.token) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
    }
    if (data?.token && data?.user) setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    if (data?.token) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
    }
    if (data?.token && data?.user) setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth(){ return useContext(AuthCtx) }
