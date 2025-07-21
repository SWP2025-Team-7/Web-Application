export interface User {
  user_id: number
  alias: string
  mail: string
  name: string
  surname: string
  patronymic: string
  phone_number: string
  citizens: string
  duty_to_work: "yes" | "no"
  duty_status: "working" | "unemployed" | "student"
  grant_amount: number
  duty_period: number
  company: string
  position: string
  start_date: string
  end_date: string
  salary: number
}

export interface Document {
  id: number
  file_name: string
  file_path: string
  file_type: string
  user_id: number
  created_at: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
} 