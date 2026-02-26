const BASE_URL = "http://localhost:5001/api";

// 1. Tüm taskları getir
export const fetchAllTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`);
  if (!response.ok) throw new Error("Tasklar getirilemedi");
  return await response.json();
};

// 2. Yeni task ekle (single, deadline, recurring hepsi buradan)
export const createTask = async (taskData) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error("Task eklenemedi");
  return await response.json();
};

// 3. Task güncelle (title düzenleme veya toggle, ikisi de buradan)
export const updateTask = async (id, data) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Task güncellenemedi");
  return await response.json();
};

// 4. Task sil
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Task silinemedi");
  return await response.json();
};
