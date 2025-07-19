import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8000'

export async function POST() {
  try {
    const testUser = {
      user_id: Math.floor(Math.random() * 1000) + 100,
      alias: "test_user_" + Math.floor(Math.random() * 1000),
      mail: "test" + Math.floor(Math.random() * 1000) + "@example.com",
      name: "Тест",
      surname: "Пользователь",
      phone_number: "+7 (999) 123-45-67",
      citizens: "Россия",
      duty_to_work: "yes",
      duty_status: "working",
      grant_amount: 0,
      duty_period: 0,
      salary: 0
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