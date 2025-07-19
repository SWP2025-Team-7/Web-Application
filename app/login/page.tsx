"use client"

import { useRouter } from 'next/navigation'
import LoginForm from '@/components/login-form'

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = (user: any) => {
    console.log('Login successful, redirecting to dashboard...')
    // Здесь можно сохранить токен в localStorage или cookies
    if (user.token) {
      localStorage.setItem('authToken', user.token)
    }
    // Перенаправляем на главную страницу после успешной авторизации
    router.push('/')
  }

  const handleLoginError = (error: string) => {
    console.error('Login failed:', error)
    // Ошибка уже обрабатывается в компоненте формы
  }

  return (
    <LoginForm 
      onLoginSuccess={handleLoginSuccess}
      onLoginError={handleLoginError}
    />
  )
} 