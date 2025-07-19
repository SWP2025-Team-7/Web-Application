"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiService } from "@/lib/api"

export default function ApiTest() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setResult("Тестирование API...")
    
    try {
      // Тестируем через наш прокси
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Testing /api/users:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        setResult(`Успех! API работает через прокси. Получено ${Array.isArray(data) ? data.length : 'данные'}`)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setResult(`Ошибка: ${errorData.error || response.statusText}`)
      }
      
    } catch (error) {
      setResult(`Исключение: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Тест API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testApi} disabled={loading}>
          {loading ? "Тестирование..." : "Тестировать API"}
        </Button>
        <div className="p-3 bg-gray-100 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      </CardContent>
    </Card>
  )
} 