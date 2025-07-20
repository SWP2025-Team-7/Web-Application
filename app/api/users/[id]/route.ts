import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// Моковые данные для тестирования (глобальная переменная для обновления)
let MOCK_USERS = {
  1: {
    user_id: 1,
    alias: "@test_user",
    mail: "test@example.com",
    name: "Иван",
    surname: "Иванов",
    patronymic: "Иванович",
    phone_number: "+7 (999) 123-45-67",
    citizens: "Россия",
    duty_to_work: "yes",
    duty_status: "working",
    grant_amount: 500000,
    duty_period: 12,
    company: "ООО Тест",
    position: "Разработчик",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    salary: 150000
  },
  2: {
    user_id: 2,
    alias: "@demo_user",
    mail: "demo@example.com",
    name: "Петр",
    surname: "Петров",
    patronymic: "Петрович",
    phone_number: "+7 (999) 987-65-43",
    citizens: "Россия",
    duty_to_work: "no",
    duty_status: "student",
    grant_amount: 300000,
    duty_period: 6,
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    salary: 0
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    
    // Пробуем подключиться к реальному бэкенду
    try {
      const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      console.log(`Backend response for user ${userId}:`, response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          { error: errorData.detail || `HTTP error! status: ${response.status}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (backendError) {
      console.log('Backend недоступен, используем моковые данные:', backendError)
      const mockUser = MOCK_USERS[Number(userId)]
      if (mockUser) {
        console.log('Returning mock user:', mockUser)
        return NextResponse.json(mockUser)
      } else {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
    }
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    const body = await request.json()
    
    console.log(`PATCH request for user ${userId}:`, JSON.stringify(body, null, 2))
    
    // Пробуем подключиться к реальному бэкенду
    try {
      const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      console.log(`Backend PATCH response for user ${userId}:`, response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Backend error details:', errorData)
        console.log('Backend недоступен или вернул ошибку, используем моковые данные')
        // При ошибке бэкенда используем моковые данные
        const mockUser = MOCK_USERS[Number(userId)]
        if (mockUser) {
          const updatedUser = { ...mockUser, ...body }
          // Обновляем моковые данные в памяти
          MOCK_USERS[Number(userId)] = updatedUser
          console.log('Updated mock user:', updatedUser)
          return NextResponse.json(updatedUser)
        } else {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        }
      }

      const data = await response.json()
      console.log('Backend success response:', data)
      return NextResponse.json(data)
    } catch (backendError) {
      console.log('Backend недоступен, обновляем моковые данные:', backendError)
      const mockUser = MOCK_USERS[Number(userId)]
      if (mockUser) {
        const updatedUser = { ...mockUser, ...body }
        // Обновляем моковые данные в памяти
        MOCK_USERS[Number(userId)] = updatedUser
        console.log('Updated mock user:', updatedUser)
        return NextResponse.json(updatedUser)
      } else {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
    }
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    
    const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
      method: 'DELETE',
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 