import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8000'

// Список известных пользователей для загрузки
const KNOWN_USER_IDS = [354, 123456, 851230, 854609, 999999, 123457, 123458]

export async function GET() {
  try {
    console.log('Fetching all users from backend...')
    
    // Загружаем всех известных пользователей
    const users = []
    
    for (const userId of KNOWN_USER_IDS) {
      try {
        const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const userData = await response.json()
          users.push(userData)
          console.log(`Loaded user ${userId}:`, userData.name)
        } else {
          console.log(`User ${userId} not found`)
        }
      } catch (error) {
        console.log(`Error loading user ${userId}:`, error)
      }
    }

    console.log(`Loaded ${users.length} users from backend`)
    return NextResponse.json(users)
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
    
    // Добавляем нового пользователя в список известных пользователей
    if (data.user_id) {
      KNOWN_USER_IDS.push(data.user_id)
      console.log(`Added user ${data.user_id} to known users list`)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 