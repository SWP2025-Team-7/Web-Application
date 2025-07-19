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
      // Сначала тестируем создание пользователя
      const createResponse = await fetch('/api/test-user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Testing POST /api/test-user:', createResponse.status, createResponse.statusText)
      
      if (createResponse.ok) {
        const createData = await createResponse.json()
        setResult(`Успех! Пользователь создан. ID: ${createData.user_id}`)
      } else {
        const errorData = await createResponse.json().catch(() => ({}))
        setResult(`Ошибка создания: ${errorData.error || createResponse.statusText}`)
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