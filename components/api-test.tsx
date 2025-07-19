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
      // Тестируем разные варианты эндпоинтов
      const endpoints = ['/users', '/users/', '/api/users', '/api/users/']
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`http://localhost:8000${endpoint}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          })
          
          console.log(`Testing ${endpoint}:`, response.status, response.statusText)
          
          if (response.ok) {
            const data = await response.json()
            setResult(`Успех! Эндпоинт ${endpoint} работает. Получено ${Array.isArray(data) ? data.length : 'данные'}`)
            return
          }
        } catch (error) {
          console.log(`Error testing ${endpoint}:`, error)
        }
      }
      
      setResult("Все эндпоинты недоступны. Проверьте сервер на localhost:8000")
      
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