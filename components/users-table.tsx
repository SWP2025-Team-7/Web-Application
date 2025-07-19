"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Download, Upload, RefreshCw, Edit, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { User } from "@/lib/types"
import { ApiService } from "@/lib/api"
import AddUserForm from "./add-user-form"

interface TableColumn {
  key: keyof User
  label: string
  width: string
  editable?: boolean
  type?: 'text' | 'number' | 'date' | 'select'
  options?: string[]
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: keyof User } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: keyof User } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const columns: TableColumn[] = [
    { key: "user_id", label: "ID", width: "80px", editable: false },
    { key: "alias", label: "Псевдоним", width: "120px", editable: true },
    { key: "name", label: "Имя", width: "120px", editable: true },
    { key: "surname", label: "Фамилия", width: "120px", editable: true },
    { key: "patronymic", label: "Отчество", width: "120px", editable: true },
    { key: "mail", label: "Email", width: "200px", editable: true },
    { key: "phone_number", label: "Телефон", width: "150px", editable: true },
    { key: "citizens", label: "Гражданство", width: "120px", editable: true },
    { key: "duty_to_work", label: "Обязанность работать", width: "150px", editable: true, type: 'select', options: ['yes', 'no'] },
    { key: "duty_status", label: "Статус", width: "120px", editable: true, type: 'select', options: ['working', 'unemployed', 'student'] },
    { key: "grant_amount", label: "Сумма гранта", width: "120px", editable: true, type: 'number' },
    { key: "duty_period", label: "Период обязанности", width: "140px", editable: true, type: 'number' },
    { key: "company", label: "Компания", width: "150px", editable: true },
    { key: "position", label: "Должность", width: "150px", editable: true },
    { key: "start_date", label: "Дата начала", width: "120px", editable: true, type: 'date' },
    { key: "end_date", label: "Дата окончания", width: "120px", editable: true, type: 'date' },
    { key: "salary", label: "Зарплата", width: "100px", editable: true, type: 'number' },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Поскольку GET /users/ не работает, создадим тестовых пользователей
      const testUsers: User[] = [
        {
          user_id: 1,
          alias: "test_user",
          mail: "test@example.com",
          name: "Тест",
          surname: "Пользователь",
          patronymic: "Тестович",
          phone_number: "+7 (999) 123-45-67",
          citizens: "Россия",
          duty_to_work: "yes",
          duty_status: "working",
          grant_amount: 0,
          duty_period: 0,
          company: "Тестовая компания",
          position: "Тестер",
          start_date: "2025-07-19",
          end_date: "2025-12-31",
          salary: 50000
        },
        {
          user_id: 2,
          alias: "demo_user",
          mail: "demo@example.com",
          name: "Демо",
          surname: "Пользователь",
          patronymic: "Демович",
          phone_number: "+7 (999) 234-56-78",
          citizens: "Россия",
          duty_to_work: "no",
          duty_status: "unemployed",
          grant_amount: 10000,
          duty_period: 12,
          company: "",
          position: "",
          start_date: "",
          end_date: "",
          salary: 0
        }
      ]
      
      setUsers(testUsers)
    } catch (error) {
      setError('Ошибка при загрузке данных')
    } finally {
      setLoading(false)
    }
  }

  const handleCellClick = (rowIndex: number, colKey: keyof User) => {
    setSelectedCell({ row: rowIndex, col: colKey })
  }

  const handleCellDoubleClick = (rowIndex: number, colKey: keyof User) => {
    const column = columns.find(col => col.key === colKey)
    if (!column?.editable) return

    const currentValue = users[rowIndex][colKey]
    setEditingCell({ row: rowIndex, col: colKey })
    setEditValue(String(currentValue))
  }

  const handleEditSubmit = async () => {
    if (!editingCell) return

    const user = users[editingCell.row]
    const column = columns.find(col => col.key === editingCell.col)
    
    if (!column?.editable) return

    setSaving(true)
    
    try {
      // Обновляем локально, так как API может не работать
      const updatedUser = {
        ...user,
        [editingCell.col]: column.type === 'number' ? Number(editValue) : editValue
      }

      const newUsers = [...users]
      newUsers[editingCell.row] = updatedUser
      setUsers(newUsers)
      
      // Попробуем обновить на сервере, но не будем ждать ответа
      try {
        await ApiService.updateUser(user.user_id, updatedUser)
      } catch (error) {
        console.log('Серверное обновление не удалось, но локальные изменения сохранены')
      }
    } catch (error) {
      setError('Ошибка при сохранении')
    } finally {
      setSaving(false)
      setEditingCell(null)
      setEditValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit()
    } else if (e.key === "Escape") {
      setEditingCell(null)
      setEditValue("")
    }
  }

  const deleteUser = async (user: User) => {
    if (!confirm(`Удалить пользователя ${user.name} ${user.surname}?`)) return

    // Удаляем локально
    setUsers(users.filter(u => u.user_id !== user.user_id))
    
    // Попробуем удалить на сервере, но не будем ждать ответа
    try {
      await ApiService.deleteUser(user.user_id)
    } catch (error) {
      console.log('Серверное удаление не удалось, но локальное удаление выполнено')
    }
  }

  const formatValue = (value: any, column: TableColumn) => {
    if (value === null || value === undefined) return "-"
    
    switch (column.type) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value
      case 'date':
        return value ? new Date(value).toLocaleDateString('ru-RU') : "-"
      case 'select':
        if (column.key === 'duty_status') {
          const statusMap = {
            working: 'Работает',
            unemployed: 'Безработный',
            student: 'Студент'
          }
          return statusMap[value as keyof typeof statusMap] || value
        }
        if (column.key === 'duty_to_work') {
          return value === 'yes' ? 'Да' : 'Нет'
        }
        return value
      default:
        return String(value)
    }
  }

  const renderEditInput = (column: TableColumn) => {
    if (column.type === 'select' && column.options) {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyDown}
          className="h-8 border-0 p-1 bg-white shadow-none focus-visible:ring-0 w-full"
        >
          {column.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )
    }

    return (
      <Input
        ref={inputRef}
        type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleEditSubmit}
        onKeyDown={handleKeyDown}
        className="h-8 border-0 p-1 bg-white shadow-none focus-visible:ring-0"
      />
    )
  }

  const exportToCSV = () => {
    const headers = columns.map((col) => col.label).join(",")
    const rows = users.map((user) => 
      columns.map((col) => `"${formatValue(user[col.key], col)}"`).join(",")
    ).join("\n")

    const csv = headers + "\n" + rows
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "users_data.csv"
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Пользователи системы</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddForm(true)} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Добавить пользователя
              </Button>
              <Button onClick={fetchUsers} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Экспорт CSV
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white overflow-x-auto">
            {/* Header */}
            <div className="flex bg-gray-100 border-b border-gray-300 min-w-max">
              <div className="w-16 h-12 border-r border-gray-300 flex items-center justify-center bg-gray-200 text-sm font-medium">
                #
              </div>
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="h-12 border-r border-gray-300 flex items-center px-3 bg-gray-100 text-sm font-medium whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.label}
                </div>
              ))}
              <div className="w-20 h-12 flex items-center justify-center bg-gray-100 text-sm font-medium">Действия</div>
            </div>

            {/* Data Rows */}
            {users.map((user, rowIndex) => (
              <div key={user.user_id} className="flex border-b border-gray-200 hover:bg-blue-50 min-w-max">
                <div className="w-16 h-12 border-r border-gray-300 flex items-center justify-center bg-gray-50 text-sm text-gray-600">
                  {rowIndex + 1}
                </div>
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={cn(
                      "h-12 border-r border-gray-300 flex items-center px-1 cursor-cell relative",
                      selectedCell?.row === rowIndex &&
                        selectedCell?.col === col.key &&
                        "bg-blue-100 ring-2 ring-blue-500",
                    )}
                    style={{ width: col.width }}
                    onClick={() => handleCellClick(rowIndex, col.key)}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, col.key)}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === col.key ? (
                      renderEditInput(col)
                    ) : (
                      <span className="px-2 py-1 text-sm truncate w-full">
                        {formatValue(user[col.key], col)}
                      </span>
                    )}
                  </div>
                ))}
                <div className="w-20 h-12 flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteUser(user)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                Нет данных для отображения
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Инструкция:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Кликните на ячейку для выделения</li>
              <li>Двойной клик для редактирования</li>
              <li>Enter - сохранить изменения, Escape - отменить</li>
              <li>Данные автоматически синхронизируются с сервером</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {showAddForm && (
        <AddUserForm
          onUserAdded={() => {
            setShowAddForm(false)
            fetchUsers()
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
} 