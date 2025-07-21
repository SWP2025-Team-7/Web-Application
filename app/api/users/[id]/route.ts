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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params
    const auth = request.headers.get('authorization')
    const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(auth ? { 'Authorization': auth } : {}),
      },
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params
    const auth = request.headers.get('authorization')
    const body = await request.text()
    const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(auth ? { 'Authorization': auth } : {}),
      },
      body,
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params
    const auth = request.headers.get('authorization')
    const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(auth ? { 'Authorization': auth } : {}),
      },
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 