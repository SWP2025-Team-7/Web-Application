"use client"

import UsersTable from "@/components/users-table"

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div>
      <UsersTable />
    </div>
  )
}
