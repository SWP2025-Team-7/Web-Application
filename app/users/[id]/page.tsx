"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Mail, Phone, Building, Calendar, DollarSign, GraduationCap, Briefcase, Edit, Save, X, FileText, Download, Eye } from "lucide-react"
import { User as UserType, Document } from "@/lib/types"
import { ApiService } from "@/lib/api"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<UserType>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [documentsError, setDocumentsError] = useState<string | null>(null)

  const userId = Number(params.id)

  useEffect(() => {
    if (userId) {
      fetchUser()
      fetchDocuments()
    }
  }, [userId])

  const fetchUser = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await ApiService.getUser(userId)
      
      if (response.error) {
        console.error('API Error:', response.error)
        setError('Пользователь не найден')
      } else {
        setUser(response.data || null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setError('Ошибка при загрузке данных пользователя')
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    setDocumentsLoading(true)
    setDocumentsError(null)
    
    try {
      const response = await ApiService.getUserDocuments(userId)
      
      if (response.error) {
        console.error('Documents API Error:', response.error)
        setDocumentsError('Ошибка при загрузке документов')
      } else {
        setDocuments(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocumentsError('Ошибка при загрузке документов')
    } finally {
      setDocumentsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const formatSalary = (salary: number) => {
    return salary.toLocaleString('ru-RU') + ' ₽'
  }

  const getDutyStatusLabel = (status: string) => {
    const statusMap = {
      working: 'Работает',
      unemployed: 'Безработный',
      student: 'Студент'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getDutyStatusColor = (status: string) => {
    const colorMap = {
      working: 'bg-green-100 text-green-800',
      unemployed: 'bg-red-100 text-red-800',
      student: 'bg-blue-100 text-blue-800'
    }
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  const handleEditClick = () => {
    if (user) {
      setEditData({ ...user })
      setIsEditing(true)
      setSaveError(null)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({})
    setSaveError(null)
  }

  const handleInputChange = (field: keyof UserType, value: string | number) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!user || !editData) return

    setSaving(true)
    setSaveError(null)

    try {
      const response = await ApiService.updateUser(user.user_id, editData)
      
      if (response.error) {
        setSaveError(response.error)
      } else {
        // Обновляем локальное состояние
        setUser(response.data || { ...user, ...editData })
        setIsEditing(false)
        setEditData({})
      }
    } catch (error) {
      setSaveError('Ошибка при сохранении данных')
    } finally {
      setSaving(false)
    }
  }

  const getFileTypeLabel = (fileType: string) => {
    const typeMap: { [key: string]: string } = {
      '2-ndfl': '2-НДФЛ',
      'passport': 'Паспорт',
      'contract': 'Договор',
      'certificate': 'Справка',
      'other': 'Другое'
    }
    return typeMap[fileType] || fileType
  }

  const getFileTypeColor = (fileType: string) => {
    const colorMap: { [key: string]: string } = {
      '2-ndfl': 'bg-blue-100 text-blue-800',
      'passport': 'bg-green-100 text-green-800',
      'contract': 'bg-purple-100 text-purple-800',
      'certificate': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colorMap[fileType] || 'bg-gray-100 text-gray-800'
  }

  const handleDownloadDocument = (document: Document) => {
    // Здесь можно добавить логику скачивания документа
    console.log('Downloading document:', document.file_path)
    alert(`Скачивание документа: ${document.file_name}`)
  }

  const handleViewDocument = (document: Document) => {
    // Здесь можно добавить логику просмотра документа
    console.log('Viewing document:', document.file_path)
    alert(`Просмотр документа: ${document.file_name}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Загрузка данных пользователя...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Пользователь не найден</h2>
                <p className="text-gray-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
                 <Button 
           onClick={() => router.back()} 
           variant="outline" 
           className="mb-4"
         >
           <ArrowLeft className="w-4 h-4 mr-2" />
           Назад к списку
         </Button>

         {saveError && (
           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
             {saveError}
           </div>
         )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                     <User className="w-6 h-6 text-blue-600" />
                   </div>
                   <div>
                     <CardTitle className="text-2xl">
                       {isEditing ? (
                         <div className="space-y-2">
                           <Input
                             value={editData.surname || ''}
                             onChange={(e) => handleInputChange('surname', e.target.value)}
                             placeholder="Фамилия"
                             className="text-2xl font-bold"
                           />
                           <Input
                             value={editData.name || ''}
                             onChange={(e) => handleInputChange('name', e.target.value)}
                             placeholder="Имя"
                             className="text-2xl font-bold"
                           />
                           <Input
                             value={editData.patronymic || ''}
                             onChange={(e) => handleInputChange('patronymic', e.target.value)}
                             placeholder="Отчество"
                             className="text-2xl font-bold"
                           />
                         </div>
                       ) : (
                         `${user.surname} ${user.name} ${user.patronymic}`
                       )}
                     </CardTitle>
                     <p className="text-gray-600">ID: {user.user_id}</p>
                   </div>
                 </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Контактная информация */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Контактная информация
                  </h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-medium text-gray-600">Email</label>
                       {isEditing ? (
                         <Input
                           value={editData.mail || ''}
                           onChange={(e) => handleInputChange('mail', e.target.value)}
                           placeholder="Email"
                         />
                       ) : (
                         <p className="text-gray-900">{user.mail || "-"}</p>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Телефон</label>
                       {isEditing ? (
                         <Input
                           value={editData.phone_number || ''}
                           onChange={(e) => handleInputChange('phone_number', e.target.value)}
                           placeholder="Телефон"
                         />
                       ) : (
                         <p className="text-gray-900">{user.phone_number || "-"}</p>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Псевдоним</label>
                       {isEditing ? (
                         <Input
                           value={editData.alias || ''}
                           onChange={(e) => handleInputChange('alias', e.target.value)}
                           placeholder="Псевдоним"
                         />
                       ) : (
                         <p className="text-gray-900">{user.alias || "-"}</p>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Гражданство</label>
                       {isEditing ? (
                         <Input
                           value={editData.citizens || ''}
                           onChange={(e) => handleInputChange('citizens', e.target.value)}
                           placeholder="Гражданство"
                         />
                       ) : (
                         <p className="text-gray-900">{user.citizens || "-"}</p>
                       )}
                     </div>
                   </div>
                </div>

                <Separator />

                {/* Рабочая информация */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Рабочая информация
                  </h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-medium text-gray-600">Компания</label>
                       {isEditing ? (
                         <Input
                           value={editData.company || ''}
                           onChange={(e) => handleInputChange('company', e.target.value)}
                           placeholder="Компания"
                         />
                       ) : (
                         <p className="text-gray-900">{user.company || "-"}</p>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Должность</label>
                       {isEditing ? (
                         <Input
                           value={editData.position || ''}
                           onChange={(e) => handleInputChange('position', e.target.value)}
                           placeholder="Должность"
                         />
                       ) : (
                         <p className="text-gray-900">{user.position || "-"}</p>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Зарплата</label>
                       {isEditing ? (
                         <Input
                           type="number"
                           value={editData.salary || ''}
                           onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                           placeholder="Зарплата"
                         />
                       ) : (
                         <p className="text-gray-900">{user.salary ? formatSalary(user.salary) : "-"}</p>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Период работы</label>
                       {isEditing ? (
                         <div className="space-y-2">
                           <Input
                             type="date"
                             value={editData.start_date || ''}
                             onChange={(e) => handleInputChange('start_date', e.target.value)}
                             placeholder="Дата начала"
                           />
                           <Input
                             type="date"
                             value={editData.end_date || ''}
                             onChange={(e) => handleInputChange('end_date', e.target.value)}
                             placeholder="Дата окончания"
                           />
                         </div>
                       ) : (
                         <div className="text-gray-900">
                           {user.start_date && user.end_date ? (
                             <span>{formatDate(user.start_date)} - {formatDate(user.end_date)}</span>
                           ) : (
                             "-"
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                </div>

                <Separator />

                {/* Информация о гранте и обязанностях */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Грант и обязанности
                  </h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-medium text-gray-600">Сумма гранта</label>
                       {isEditing ? (
                         <Input
                           type="number"
                           value={editData.grant_amount || ''}
                           onChange={(e) => handleInputChange('grant_amount', Number(e.target.value))}
                           placeholder="Сумма гранта"
                         />
                       ) : (
                         <p className="text-gray-900">{user.grant_amount ? formatSalary(user.grant_amount) : "-"}</p>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Период обязанности</label>
                       {isEditing ? (
                         <Input
                           type="number"
                           value={editData.duty_period || ''}
                           onChange={(e) => handleInputChange('duty_period', Number(e.target.value))}
                           placeholder="Период (месяцев)"
                         />
                       ) : (
                         <p className="text-gray-900">{user.duty_period ? `${user.duty_period} месяцев` : "-"}</p>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Обязанность работать</label>
                       {isEditing ? (
                         <Select
                           value={editData.duty_to_work || 'yes'}
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
                       ) : (
                         <Badge variant={user.duty_to_work === 'yes' ? 'default' : 'secondary'}>
                           {user.duty_to_work === 'yes' ? 'Да' : 'Нет'}
                         </Badge>
                       )}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-600">Статус</label>
                       {isEditing ? (
                         <Select
                           value={editData.duty_status || 'working'}
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
                       ) : (
                         <Badge className={`${getDutyStatusColor(user.duty_status)}`}>
                           {getDutyStatusLabel(user.duty_status)}
                         </Badge>
                       )}
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Документы */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Документы
                </h3>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Загрузка документов...</p>
                  </div>
                ) : documentsError ? (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {documentsError}
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Документы не найдены</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.file_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-xs ${getFileTypeColor(doc.file_type)}`}>
                                {getFileTypeLabel(doc.file_type)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDate(doc.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocument(doc)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            title="Просмотреть"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-50"
                            title="Скачать"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-4">
            {/* Статус */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Статус</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`w-full justify-center ${getDutyStatusColor(user.duty_status)}`}>
                  {getDutyStatusLabel(user.duty_status)}
                </Badge>
              </CardContent>
            </Card>

                         {/* Быстрые действия */}
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Действия</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                 {!isEditing ? (
                   <Button 
                     variant="outline" 
                     className="w-full"
                     onClick={handleEditClick}
                   >
                     <Edit className="w-4 h-4 mr-2" />
                     Редактировать
                   </Button>
                 ) : (
                   <div className="space-y-2">
                     <Button 
                       variant="default" 
                       className="w-full"
                       onClick={handleSave}
                       disabled={saving}
                     >
                       <Save className="w-4 h-4 mr-2" />
                       {saving ? 'Сохранение...' : 'Сохранить'}
                     </Button>
                     <Button 
                       variant="outline" 
                       className="w-full"
                       onClick={handleCancelEdit}
                       disabled={saving}
                     >
                       <X className="w-4 h-4 mr-2" />
                       Отменить
                     </Button>
                   </div>
                 )}
                 <Button 
                   variant="outline" 
                   className="w-full"
                   onClick={() => {
                     // Здесь можно добавить функционал экспорта
                     alert('Функция экспорта будет добавлена позже')
                   }}
                 >
                   Экспорт данных
                 </Button>
               </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 