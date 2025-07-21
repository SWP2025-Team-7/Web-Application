import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// Моковые данные для тестирования
const MOCK_USERS = [
  {
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
  {
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
]

export async function GET() {
  try {
    console.log('Fetching all users from backend...')
    
    // Пробуем подключиться к реальному бэкенду
    try {
      const response = await fetch(`${BACKEND_URL}/users/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      console.log('Backend GET response:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Backend error details:', JSON.stringify(errorData, null, 2))
        return NextResponse.json(
          { error: errorData.detail || `HTTP error! status: ${response.status}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      console.log(`Loaded ${data.length} users from backend`)
      return NextResponse.json(data)
    } catch (backendError) {
      console.log('Backend недоступен, используем моковые данные:', backendError)
      return NextResponse.json(MOCK_USERS)
    }
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST request received')
    const body = await request.json()
    
    console.log('POST request to create user:', JSON.stringify(body, null, 2))
    
    // Пробуем подключиться к реальному бэкенду
    try {
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
    } catch (backendError) {
      console.log('Backend недоступен, создаем мокового пользователя:', backendError)
      const newUser = {
        ...body,
        user_id: Math.floor(Math.random() * 1000000) + 100000,
        mail: body.mail || "test@example.com",
        name: body.name || "Тест",
        surname: body.surname || "Пользователь",
        patronymic: body.patronymic || "",
        phone_number: body.phone_number || "+7 (999) 000-00-00",
        citizens: body.citizens || "Россия",
        duty_to_work: body.duty_to_work || "yes",
        duty_status: body.duty_status || "working",
        grant_amount: body.grant_amount || 0,
        duty_period: body.duty_period || 0,
        company: body.company || "",
        position: body.position || "",
        start_date: body.start_date || "",
        end_date: body.end_date || "",
        salary: body.salary || 0
      }
      return NextResponse.json(newUser)
    }
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 