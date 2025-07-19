import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-gray-600">Страница не найдена</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Запрашиваемая страница не существует или была перемещена.
          </p>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/">
                На главную
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
              Назад
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 