import "./App.css";
import TaskItem from "./components/TaskItem";
import DeadlineTaskItem from "./components/DeadlineTaskItem";
import AddTaskInput from "./components/AddTaskInput";
import "./styles/checkbox-wrapper.css";
import "./styles/TaskItem.css";
import "./styles/AddTaskInput.css";

import { useState } from "react";

function App() {
  // 1. Veri yapısını Obje Array'ine çevirdik
  const [tasks, setTasks] = useState([
    { title: "Mikrowelle Al", isCompleted: false },
    { title: "Kahve Demle", isCompleted: true },
    { title: "Kiraz Cekirdegi Yastigi Al", isCompleted: false },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  // 2. Yeni görev ekleme fonksiyonunu güncelle
  const handleSave = (text) => {
    const newTask = { title: text, isCompleted: false };
    setTasks([...tasks, newTask]);
    setIsAdding(false);
  };

  // 3. Tamamlama (Toggle) fonksiyonu
  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].isCompleted = !newTasks[index].isCompleted;
    setTasks(newTasks);
  };

  // 4. Silme fonksiyonu
  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

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
                {tasks.map((task, index) => (
                  <TaskItem
                    key={index}
                    title={task.title} // task değil, task.title olmalı!
                    isCompleted={task.isCompleted}
                    onToggle={() => toggleTask(index)}
                    onDelete={() => deleteTask(index)}
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
