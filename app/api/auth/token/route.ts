import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: Request) {
  try {
    const body = await request.text() // form-data, не JSON!
    try {
      const response = await fetch(`${BACKEND_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body,
      })
      const text = await response.text()
      try {
        const data = JSON.parse(text)
        return NextResponse.json(data, { status: response.status })
      } catch {
        return new NextResponse(text, { status: response.status })
      }
    } catch (backendError) {
      // Если бэкенд недоступен — вернуть моковый токен
      return NextResponse.json({
        access_token: 'mock.jwt.token',
        token_type: 'bearer',
      })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 