"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Download, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableRow {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  salary: string
}

export default function ExcelCrudTable() {
  const [data, setData] = useState<TableRow[]>([
    {
      id: "1",
      name: "Иван Петров",
      email: "ivan.petrov@example.com",
      phone: "+7 (999) 123-45-67",
      position: "Разработчик",
      department: "IT",
      salary: "120000",
    },
    {
      id: "2",
      name: "Мария Сидорова",
      email: "maria.sidorova@example.com",
      phone: "+7 (999) 234-56-78",
      position: "Дизайнер",
      department: "Дизайн",
      salary: "95000",
    },
    {
      id: "3",
      name: "Алексей Козлов",
      email: "alexey.kozlov@example.com",
      phone: "+7 (999) 345-67-89",
      position: "Менеджер",
      department: "Продажи",
      salary: "85000",
    },
  ])

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const columns = [
    { key: "name", label: "Имя", width: "200px" },
    { key: "email", label: "Email", width: "250px" },
    { key: "phone", label: "Телефон", width: "180px" },
    { key: "position", label: "Должность", width: "180px" },
    { key: "department", label: "Отдел", width: "150px" },
    { key: "salary", label: "Зарплата", width: "120px" },
  ]

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const handleCellClick = (rowIndex: number, colKey: string) => {
    setSelectedCell({ row: rowIndex, col: colKey })
  }

  const handleCellDoubleClick = (rowIndex: number, colKey: string) => {
    const currentValue = data[rowIndex][colKey as keyof TableRow]
    setEditingCell({ row: rowIndex, col: colKey })
    setEditValue(currentValue)
  }

  const handleEditSubmit = () => {
    if (editingCell) {
      const newData = [...data]
      newData[editingCell.row] = {
        ...newData[editingCell.row],
        [editingCell.col]: editValue,
      }
      setData(newData)
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

  const addNewRow = () => {
    const newRow: TableRow = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      salary: "",
    }
    setData([...data, newRow])
  }

  const deleteRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index)
    setData(newData)
    setSelectedCell(null)
  }

  const exportToCSV = () => {
    const headers = columns.map((col) => col.label).join(",")
    const rows = data.map((row) => columns.map((col) => `"${row[col.key as keyof TableRow]}"`).join(",")).join("\n")

    const csv = headers + "\n" + rows
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "table_data.csv"
    link.click()
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const csv = event.target?.result as string
        const lines = csv.split("\n")
        const headers = lines[0].split(",")

        const importedData = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line, index) => {
            const values = line.split(",").map((val) => val.replace(/"/g, ""))
            return {
              id: (Date.now() + index).toString(),
              name: values[0] || "",
              email: values[1] || "",
              phone: values[2] || "",
              position: values[3] || "",
              department: values[4] || "",
              salary: values[5] || "",
            }
          })

        setData(importedData)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Excel CRUD Таблица</CardTitle>
            <div className="flex gap-2">
              <Button onClick={addNewRow} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Добавить строку
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Экспорт CSV
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Импорт CSV
                  </span>
                </Button>
                <input type="file" accept=".csv" onChange={handleFileImport} className="hidden" />
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            {/* Header */}
            <div className="flex bg-gray-100 border-b border-gray-300">
              <div className="w-12 h-10 border-r border-gray-300 flex items-center justify-center bg-gray-200 text-sm font-medium">
                #
              </div>
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="h-10 border-r border-gray-300 flex items-center px-3 bg-gray-100 text-sm font-medium"
                  style={{ width: col.width }}
                >
                  {col.label}
                </div>
              ))}
              <div className="w-16 h-10 flex items-center justify-center bg-gray-100 text-sm font-medium">Действия</div>
            </div>

            {/* Data Rows */}
            {data.map((row, rowIndex) => (
              <div key={row.id} className="flex border-b border-gray-200 hover:bg-blue-50">
                <div className="w-12 h-10 border-r border-gray-300 flex items-center justify-center bg-gray-50 text-sm text-gray-600">
                  {rowIndex + 1}
                </div>
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={cn(
                      "h-10 border-r border-gray-300 flex items-center px-1 cursor-cell relative",
                      selectedCell?.row === rowIndex &&
                        selectedCell?.col === col.key &&
                        "bg-blue-100 ring-2 ring-blue-500",
                    )}
                    style={{ width: col.width }}
                    onClick={() => handleCellClick(rowIndex, col.key)}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, col.key)}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === col.key ? (
                      <Input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleEditSubmit}
                        onKeyDown={handleKeyDown}
                        className="h-8 border-0 p-1 bg-white shadow-none focus-visible:ring-0"
                      />
                    ) : (
                      <span className="px-2 py-1 text-sm truncate w-full">{row[col.key as keyof TableRow]}</span>
                    )}
                  </div>
                ))}
                <div className="w-16 h-10 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRow(rowIndex)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Инструкция:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Кликните на ячейку для выделения</li>
              <li>Двойной клик для редактирования</li>
              <li>Enter - сохранить изменения, Escape - отменить</li>
              <li>Используйте кнопки для добавления строк и экспорта данных</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
