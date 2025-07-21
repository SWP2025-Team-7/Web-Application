import { NextResponse } from 'next/server'

const BACKEND_URL = 'http://backend:8000'

export async function POST(request: Request) {
  try {
    console.log('Login request received')
    const body = await request.json()
    
    console.log('Login request data:', JSON.stringify(body, null, 2))
    
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('Backend login response:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend login error details:', JSON.stringify(errorData, null, 2))
      return NextResponse.json(
        { error: errorData.detail || `HTTP error! status: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Backend login success response:', JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Login Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 