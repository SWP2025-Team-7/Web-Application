'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-red-600">Что-то пошло не так!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Произошла ошибка при загрузке страницы. Попробуйте обновить страницу или вернуться позже.
          </p>
          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1">
              Попробовать снова
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
              На главную
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-500">Детали ошибки</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 