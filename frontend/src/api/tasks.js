const BASE_URL = "https://all-tasks-done.onrender.com/api";

// Her istekte token'ı header'a ekleyen yardımcı fonksiyon
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 1. Tüm taskları getir
export const fetchAllTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Tasklar getirilemedi");
  return await response.json();
};

// 2. Yeni task ekle (single, deadline, recurring hepsi buradan)
export const createTask = async (taskData) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error("Task eklenemedi");
  return await response.json();
};

// 3. Task güncelle (title düzenleme veya toggle, ikisi de buradan)
export const updateTask = async (id, data) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Task güncellenemedi");
  return await response.json();
};

// 4. Task sil
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Task silinemedi");
  return await response.json();
};
