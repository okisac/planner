import "./App.css";
import TaskItem from "./components/TaskItem";
import DeadlineTaskItem from "./components/DeadlineTaskItem";
import AddTaskInput from "./components/AddTaskInput";
import "./styles/checkbox-wrapper.css";
import "./styles/TaskItem.css";
import "./styles/AddTaskInput.css";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  // 1. Başlangıç verisine ID ve Zaman Damgaları ekledik
  const [tasks, setTasks] = useState([
    {
      id: uuidv4(),
      title: "Mikrowelle Al",
      isCompleted: false,
      createdAt: Date.now(),
      completedAt: null,
    },
    {
      id: uuidv4(),
      title: "Kahve Demle",
      isCompleted: true,
      createdAt: Date.now() - 1000,
      completedAt: Date.now(),
    },
    {
      id: uuidv4(),
      title: "Kiraz Cekirdegi Yastigi Al",
      isCompleted: false,
      createdAt: Date.now() - 2000,
      completedAt: null,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  // 2. Yeni görev ekleme (ID ve createdAt ile)
  const handleSave = (text) => {
    if (!text.trim()) return; // Boş görev eklemeyi engelle
    const newTask = {
      id: uuidv4(),
      title: text,
      isCompleted: false,
      createdAt: Date.now(), // Sıralama için önemli
      completedAt: null,
    };
    setTasks([...tasks, newTask]);
    setIsAdding(false);
  };

  // 3. Tamamlama (Toggle) - ID üzerinden işlem yapıyoruz
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newStatus = !task.isCompleted;
          return {
            ...task,
            isCompleted: newStatus,
            completedAt: newStatus ? Date.now() : null, // Tamamlandığı anı kaydet
          };
        }
        return task;
      }),
    );
  };

  // 4. Silme - ID üzerinden filtreleme
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // 5. SIRALAMA MANTIĞI (Render öncesi listeyi hazırlıyoruz)
  const sortedTasks = [...tasks].sort((a, b) => {
    // Kural 1: Tamamlanmamışlar (Active) her zaman üstte
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }

    // Kural 2: Eğer ikisi de ACTIVE ise -> Eklenme sırasına göre (Eski üstte)
    if (!a.isCompleted) {
      return a.createdAt - b.createdAt;
    }

    // Kural 3: Eğer ikisi de COMPLETED ise -> Tamamlanma sırasına göre (Eski üstte)
    return a.completedAt - b.completedAt;
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
                    +
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
              </div>
              <DeadlineTaskItem title="Vodafone Kundigung" datum="22.02.2026" />
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
