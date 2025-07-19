'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
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
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Критическая ошибка</h2>
            <p className="text-gray-600 mb-4">
              Произошла непредвиденная ошибка в приложении. Попробуйте обновить страницу.
            </p>
            <div className="flex gap-2">
              <Button onClick={reset} className="flex-1">
                Попробовать снова
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="flex-1"
              >
                На главную
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 