import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8000'

export async function POST() {
  try {
    const testUser = {
      user_id: 1,
      alias: "test_user",
      mail: "test@example.com",
      name: "Тест",
      surname: "Пользователь",
      patronymic: "Тестович",
      phone_number: "+7 (999) 123-45-67",
      citizens: "Россия",
      duty_to_work: "yes",
      duty_status: "working",
      grant_amount: 0,
      duty_period: 0,
      company: "Тестовая компания",
      position: "Тестер",
      start_date: "2025-07-19",
      end_date: "2025-12-31",
      salary: 50000
    }
    
    const response = await fetch(`${BACKEND_URL}/users/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    })

    console.log('Backend response status:', response.status)
    console.log('Backend response headers:', response.headers)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.detail || `HTTP error! status: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Backend success:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 