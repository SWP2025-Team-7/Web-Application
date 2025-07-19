import { User, ApiResponse } from './types'

const API_BASE_URL = '/api'

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          error: errorData.detail || `HTTP error! status: ${response.status}`,
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
    return this.request<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    })
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
} 