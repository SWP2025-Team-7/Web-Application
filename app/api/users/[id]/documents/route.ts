import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// Моковые документы для тестирования
const MOCK_DOCUMENTS = {
  1: [
    {
      id: 1,
      file_name: "2-НДФЛ_2024.pdf",
      file_path: "/documents/2-ndfl-2024.pdf",
      file_type: "2-ndfl",
      user_id: 1,
      created_at: "2024-01-15"
    },
    {
      id: 2,
      file_name: "Паспорт_стр1.jpg",
      file_path: "/documents/passport-page1.jpg",
      file_type: "passport",
      user_id: 1,
      created_at: "2024-01-10"
    },
    {
      id: 3,
      file_name: "Трудовой_договор.pdf",
      file_path: "/documents/employment-contract.pdf",
      file_type: "contract",
      user_id: 1,
      created_at: "2024-01-05"
    }
  ],
  2: [
    {
      id: 4,
      file_name: "Справка_об_обучении.pdf",
      file_path: "/documents/study-certificate.pdf",
      file_type: "certificate",
      user_id: 2,
      created_at: "2024-01-20"
    },
    {
      id: 5,
      file_name: "Паспорт_студента.pdf",
      file_path: "/documents/student-passport.pdf",
      file_type: "passport",
      user_id: 2,
      created_at: "2024-01-12"
    }
  ]
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    
    // Пробуем подключиться к реальному бэкенду
    try {
      const response = await fetch(`${BACKEND_URL}/users/${userId}/documents/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      console.log(`Backend documents response for user ${userId}:`, response.status)

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
      console.log('Backend недоступен, используем моковые документы:', backendError)
      const mockDocuments = MOCK_DOCUMENTS[Number(userId)] || []
      return NextResponse.json(mockDocuments)
    }
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 