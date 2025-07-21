import { User, Document, ApiResponse } from './types'

const API_BASE_URL = '/api'

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      // Получаем токен из localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        mode: 'cors',
        credentials: 'omit',
        ...options,
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText} for ${endpoint}`)
        const errorData = await response.json().catch(() => ({}))
        console.error('Error details:', errorData)
        return {
          error: errorData.detail || `HTTP error! status: ${response.status} - ${response.statusText}`,
        }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  static async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users/')
  }

  static async getUser(userId: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`)
  }

  static async createUser(user: Omit<User, 'user_id'>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  }

  static async updateUser(userId: number, user: Partial<User>): Promise<ApiResponse<User>> {
    console.log(`API Service: Updating user ${userId} with data:`, user)
    const result = await this.request<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    })
    console.log(`API Service: Update result for user ${userId}:`, result)
    return result
  }

  static async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}`, {
      method: 'DELETE',
    })
  }

  static async uploadDocument(userId: number, filePath: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${userId}/documents/upload`, {
      method: 'POST',
      body: JSON.stringify({ file_path: filePath }),
    })
  }

  static async getUserDocuments(userId: number): Promise<ApiResponse<Document[]>> {
    return this.request<Document[]>(`/users/${userId}/documents/`)
  }
} 