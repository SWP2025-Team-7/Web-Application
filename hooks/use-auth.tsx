"use client"

import { useState, useEffect, createContext, useContext } from 'react'

interface User {
  email: string
  name?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      setToken(storedToken)
      const payload = parseJwt(storedToken)
      if (payload) {
        setUser({
          email: payload.email || payload.sub || '',
          name: payload.name,
          role: payload.role,
        })
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const form = new URLSearchParams()
    form.append('grant_type', 'password')
    form.append('username', username)
    form.append('password', password)

    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.detail?.[0]?.msg || data.detail || 'Ошибка авторизации')
    }
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token)
      setToken(data.access_token)
      const payload = parseJwt(data.access_token)
      setUser({
        email: payload.email || payload.sub || username,
        name: payload.name,
        role: payload.role,
      })
    } else {
      throw new Error('Токен не получен')
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    token,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 