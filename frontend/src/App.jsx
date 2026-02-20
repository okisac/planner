import "./App.css";
import TaskItem from "./components/TaskItem";
import DeadlineTaskItem from "./components/DeadlineTaskItem";
import AddTaskInput from "./components/AddTaskInput";
import "./styles/TaskItem.css";
import "./styles/AddTaskInput.css";
import "./styles/DeadlineTaskItem.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  // 1. State başlangıçta boş bir dizi olsun
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  // 2. Sayfa açıldığında verileri Backend'den çek (READ)
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/tasks");
      // App.jsx içindeki fetchTasks fonksiyonunda:
      const data = await response.json();
      const formattedData = data.map((task) => ({
        ...task,
        isCompleted: task.is_completed, // SQL'den geleni JS formatına çevir
        createdAt: task.created_at,
      }));
      setTasks(formattedData);
    } catch (err) {
      console.error("Veriler çekilemedi:", err);
    }
  };

  // 3. Yeni görev ekleme (CREATE)
  const handleSave = async (text) => {
    if (!text.trim()) return;

    const newTask = {
      id: uuidv4(),
      title: text,
      is_completed: false, // SQL sütun ismine dikkat: is_completed
      created_at: Date.now(),
      completed_at: null,
    };

    try {
      const response = await fetch("http://localhost:5001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);
      setIsAdding(false);
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  };

  // 4. Tamamlama (UPDATE - Toggle)
  const toggleTask = async (id) => {
    const taskToToggle = tasks.find((t) => t.id === id);
    const newStatus = !taskToToggle.isCompleted; // is_completed değil, isCompleted
    const completedAt = newStatus ? Date.now() : null;

    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_completed: newStatus,
          completed_at: completedAt,
        }),
      });
      const updatedTask = await response.json();
      // Gelen veriyi yine formatla
      setTasks(
        tasks.map((t) =>
          t.id === id
            ? {
                ...updatedTask,
                isCompleted: updatedTask.is_completed,
                createdAt: updatedTask.created_at,
              }
            : t,
        ),
      );
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  // 5. Silme (DELETE)
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  // 6. Sıralama Mantığı (Aynı kalıyor, sadece sütun isimlerini güncelledik)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
    if (!a.is_completed) return a.created_at - b.created_at;
    return a.completed_at - b.completed_at;
  });

  return (
    <>
      <header>
        <h1>Plan your daily tasks</h1>
      </header>
      <main className="app-container">
        <div className="wrapper">
          <div>
            <h2>Tasks</h2>
          </div>
          <div className="task_container">
            <div className="task_type">
              <div className="task_type_head">
                <h3>Single Tasks</h3>
                <div className="add_btn_container">
                  <button className="add_btn" onClick={() => setIsAdding(true)}>
                    <span class="plus">+</span>
                  </button>
                </div>
              </div>
              <div className="task_type_body" id="single_tasks_container">
                {isAdding && (
                  <AddTaskInput
                    onCancel={() => setIsAdding(false)}
                    onSave={handleSave}
                  />
                )}
                {sortedTasks.map((task) => (
                  <TaskItem
                    key={task.id} // Index yerine benzersiz ID
                    title={task.title}
                    isCompleted={task.isCompleted}
                    onToggle={() => toggleTask(task.id)} // ID gönderiyoruz
                    onDelete={() => deleteTask(task.id)} // ID gönderiyoruz
                  />
                ))}
              </div>
            </div>
            <div className="task_type">
              <div className="task_type_head">
                <h3>Has Deadline</h3>
                <div className="add_btn_container">
                  <button className="add_btn">
                    <span className="plus">+</span>
                  </button>
                </div>
              </div>
              <div className="timeline-wrapper">
                <DeadlineTaskItem
                  title="Vodafone Kündigung"
                  subtitle="Vertrag · Kündigung"
                  day="22"
                  month="Feb"
                  year="2026"
                  urgency={3}
                  is_completed={false}
                  onToggle={() => {}}
                  onDelete={() => {}}
                />
              </div>
            </div>
            <div className="task_type">
              <div className="task_type_head">
                <h3>Recurring Tasks</h3>
              </div>
            </div>
          </div>
          <div className="ornek">
            <div className="card">asdfsadfasdf</div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
