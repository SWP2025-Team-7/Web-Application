import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8000'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/users/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || `HTTP error! status: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received')
    const body = await request.json()
    
    console.log('POST request to create user:', JSON.stringify(body, null, 2))
    
    const response = await fetch(`${BACKEND_URL}/users/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('Backend POST response:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error details:', JSON.stringify(errorData, null, 2))
      return NextResponse.json(
        { error: errorData.detail || `HTTP error! status: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Backend success response:', JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 