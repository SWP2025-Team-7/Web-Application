"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import UsersTable from "@/components/users-table"
import { useAuth } from "@/hooks/use-auth"
import LogoutButton from "@/components/logout-button"

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic'

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Перенаправление происходит в useEffect
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
        <LogoutButton />
      </div>
      <UsersTable />
    </div>
  )
}
