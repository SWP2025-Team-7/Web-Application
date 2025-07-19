const testUser = {
  user_id: 999999,
  alias: "test_user_999",
  mail: "test999@example.com",
  name: "Тест",
  surname: "Пользователь",
  patronymic: "Тестович",
  phone_number: "+7 (999) 999-99-99",
  citizens: "Россия",
  duty_to_work: "yes",
  duty_status: "working",
  grant_amount: 0,
  duty_period: 0,
  company: "Тестовая компания",
  position: "Тестер",
  start_date: "2025-01-01",
  end_date: "2025-12-31",
  salary: 50000
};

fetch('http://localhost:3000/api/users/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testUser)
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
}); 