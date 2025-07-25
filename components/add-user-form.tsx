"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { User } from "@/lib/types"
import { ApiService } from "@/lib/api"

interface AddUserFormProps {
  onUserAdded: (user?: User) => void
  onCancel: () => void
}

export default function AddUserForm({ onUserAdded, onCancel }: AddUserFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    alias: "",
    mail: "",
    name: "",
    surname: "",
    patronymic: "",
    phone_number: "",
    citizens: "",
    duty_to_work: "yes",
    duty_status: "working",
    grant_amount: 0,
    duty_period: 0,
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    salary: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof User, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Валидация обязательных полей
      if (!formData.alias || !formData.mail || !formData.name || !formData.surname || !formData.phone_number || !formData.citizens) {
        setError('Пожалуйста, заполните все обязательные поля')
        return
      }
      
      // Убеждаемся, что числовые поля имеют правильные значения
      // Бэкенд принимает только user_id и alias при создании
      const validatedData: any = {
        user_id: Math.floor(Math.random() * 1000000) + 100000, // Генерируем ID в пределах int32
        alias: formData.alias,
      }
      
      console.log('Sending user data:', validatedData)
      const response = await ApiService.createUser(validatedData)
      
      if (response.error) {
        setError(response.error)
      } else {
        // После создания пользователя обновляем его с остальными данными
        // Отправляем все поля, включая рабочие данные
        const updateData: any = {
          mail: formData.mail || "",
          name: formData.name || "",
          surname: formData.surname || "",
          patronymic: formData.patronymic || "",
          phone_number: formData.phone_number || "",
          citizens: formData.citizens || "",
          duty_to_work: formData.duty_to_work || "yes",
          duty_status: formData.duty_status || "working",
          grant_amount: Math.min(formData.grant_amount || 0, 999999999),
          duty_period: Math.min(formData.duty_period || 0, 999),
          company: formData.company || "",
          position: formData.position || "",
          start_date: formData.start_date || "",
          end_date: formData.end_date || "",
          salary: Math.min(formData.salary || 0, 999999999),
        }
        
        console.log('Updating user with additional data:', updateData)
        console.log('User ID for update:', validatedData.user_id)
        
        try {
          const updateResponse = await ApiService.updateUser(validatedData.user_id, updateData)
          
          if (updateResponse.error) {
            console.log('User created but update failed:', updateResponse.error)
            console.log('Update data that failed:', updateData)
          } else {
            console.log('User updated successfully:', updateResponse)
          }
        } catch (error) {
          console.error('Error during user update:', error)
        }
        
        // Вызываем callback для обновления таблицы с данными созданного пользователя
        const createdUser: User = {
          user_id: validatedData.user_id,
          alias: validatedData.alias,
          mail: formData.mail || "",
          name: formData.name || "",
          surname: formData.surname || "",
          patronymic: formData.patronymic || "",
          phone_number: formData.phone_number || "",
          citizens: formData.citizens || "",
          duty_to_work: formData.duty_to_work || "yes",
          duty_status: formData.duty_status || "working",
          grant_amount: Math.min(formData.grant_amount || 0, 999999999),
          duty_period: Math.min(formData.duty_period || 0, 999),
          company: formData.company || "",
          position: formData.position || "",
          start_date: formData.start_date || "",
          end_date: formData.end_date || "",
          salary: Math.min(formData.salary || 0, 999999999),
        }
        onUserAdded(createdUser)
      }
    } catch (error) {
      setError('Ошибка при создании пользователя')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Добавить нового пользователя</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alias">Псевдоним</Label>
                <Input
                  id="alias"
                  value={formData.alias}
                  onChange={(e) => handleInputChange('alias', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mail">Email</Label>
                <Input
                  id="mail"
                  type="email"
                  value={formData.mail}
                  onChange={(e) => handleInputChange('mail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">Фамилия</Label>
                <Input
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patronymic">Отчество</Label>
                <Input
                  id="patronymic"
                  value={formData.patronymic}
                  onChange={(e) => handleInputChange('patronymic', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Телефон</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizens">Гражданство</Label>
                <Input
                  id="citizens"
                  value={formData.citizens}
                  onChange={(e) => handleInputChange('citizens', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duty_to_work">Обязанность работать</Label>
                <Select
                  value={formData.duty_to_work}
                  onValueChange={(value) => handleInputChange('duty_to_work', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Да</SelectItem>
                    <SelectItem value="no">Нет</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duty_status">Статус</Label>
                <Select
                  value={formData.duty_status}
                  onValueChange={(value) => handleInputChange('duty_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working">Работает</SelectItem>
                    <SelectItem value="unemployed">Безработный</SelectItem>
                    <SelectItem value="student">Студент</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grant_amount">Сумма гранта</Label>
                <Input
                  id="grant_amount"
                  type="number"
                  min="0"
                  max="999999999"
                  value={formData.grant_amount}
                  onChange={(e) => handleInputChange('grant_amount', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duty_period">Период обязанности</Label>
                <Input
                  id="duty_period"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.duty_period}
                  onChange={(e) => handleInputChange('duty_period', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Компания</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Должность</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Дата начала</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Дата окончания</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Зарплата</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  max="999999999"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Создание..." : "Создать пользователя"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 