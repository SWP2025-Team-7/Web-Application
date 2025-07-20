"use client"

import UsersTable from "@/components/users-table"

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
      </div>
      <UsersTable />
    </div>
  )
}
