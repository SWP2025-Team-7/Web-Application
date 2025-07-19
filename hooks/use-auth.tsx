"use client"

import { useState, useEffect, createContext, useContext } from 'react'

interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем, есть ли сохраненный токен при загрузке
    const token = localStorage.getItem('authToken')
    if (token) {
      // Здесь можно добавить проверку токена на сервере
      // Пока просто устанавливаем пользователя как авторизованного
      setUser({ id: '1', email: 'user@example.com' })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка авторизации')
      }

      // Сохраняем токен
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }

      // Устанавливаем пользователя
      setUser({
        id: data.user?.id || '1',
        email: data.user?.email || email,
        name: data.user?.name,
        role: data.user?.role,
      })
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
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