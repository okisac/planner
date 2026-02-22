import "./App.css";
import TaskItem from "./components/taskItem";
import DeadlineTaskItem from "./components/DeadlineTaskItem";
import AddSingleTaskInput from "./components/AddSingleTaskInput";
import AddDeadlineTaskInput from "./components/AddDeadlineTaskInput";
import "./styles/TaskItem.css";
import "./styles/AddSingleTaskInput.css";
import "./styles/AddDeadlineTaskInput.css";
import "./styles/DeadlineTaskItem.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  // ─────────────────────────────────────────
  // ORTAK
  // ─────────────────────────────────────────

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/tasks");
      const data = await response.json();

      const singles = data
        .filter((t) => t.task_type === "single" || !t.task_type)
        .map((t) => ({
          ...t,
          isCompleted: t.is_completed, // Backend -> Frontend eşlemesi
          createdAt: t.created_at,
        }));

      const deadlines = data
        .filter((t) => t.task_type === "deadline")
        .map((t) => ({
          ...t,
          isCompleted: t.is_completed, // Backend -> Frontend eşlemesi
          deadline_date: t.deadline_date, // Tarihin kaybolmadığından emin ol
          createdAt: t.created_at,
        }));

      setSingleTasks(singles);
      setDeadlineTasks(deadlines);
    } catch (err) {
      console.error("Veriler çekilemedi:", err);
    }
  };

  // ─────────────────────────────────────────
  // SINGLE
  // ─────────────────────────────────────────

  const [singleTasks, setSingleTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = async (text) => {
    if (!text.trim()) return;

    const newTask = {
      id: uuidv4(),
      title: text,
      task_type: "single",
      is_completed: false,
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
      setSingleTasks([
        ...singleTasks,
        { ...newTask, ...savedTask, isCompleted: false },
      ]);
      setIsAdding(false);
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  };

  const toggleSingleTask = async (id) => {
    const task = singleTasks.find((t) => t.id === id);
    const newStatus = !task.isCompleted;
    const completedAt = newStatus ? Date.now() : null;

    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_completed: newStatus,
          completed_at: completedAt,
        }),
      });
      setSingleTasks(
        singleTasks.map((t) =>
          t.id === id
            ? { ...t, isCompleted: newStatus, completed_at: completedAt }
            : t,
        ),
      );
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  const deleteSingleTask = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "DELETE",
      });
      setSingleTasks(singleTasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const sortedSingleTasks = [...singleTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return a.createdAt - b.createdAt;
  });

  // ─────────────────────────────────────────
  // DEADLINE
  // ─────────────────────────────────────────

  const [deadlineTasks, setDeadlineTasks] = useState([]);
  const [isAddingDeadline, setIsAddingDeadline] = useState(false);

  const handleSaveDeadline = async (deadlineData) => {
    console.log("Gelen data:", deadlineData);
    const newTask = {
      id: uuidv4(),
      title: deadlineData.title,

      deadline_date: deadlineData.date,
      task_type: "deadline",
      is_completed: false,
      created_at: Date.now(),
    };
    console.log("Gönderilen task:", newTask);

    try {
      const response = await fetch("http://localhost:5001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const savedTask = await response.json();
      setDeadlineTasks([
        ...deadlineTasks,
        { ...newTask, ...savedTask, isCompleted: false, task_type: "deadline" },
      ]);
      setIsAddingDeadline(false);
    } catch (err) {
      console.error("Deadline ekleme hatası:", err);
    }
  };

  const toggleDeadlineTask = async (id) => {
    const task = deadlineTasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = !task.isCompleted;
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

      const updatedData = await response.json();

      setDeadlineTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t, // ÖNEMLİ: deadline_date ve task_type burada korunur
                isCompleted: newStatus,
                completed_at: completedAt,
                ...updatedData, // Backend'den gelen güncel is_completed verisini de al
                isCompleted: updatedData.is_completed, // Backend isimlendirmesine dikkat
              }
            : t,
        ),
      );
    } catch (err) {
      console.error("Deadline güncelleme hatası:", err);
    }
  };

  const deleteDeadlineTask = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "DELETE",
      });
      setDeadlineTasks(deadlineTasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const parseDeadlineDate = (dateStr) => {
    // console.log("Gelen Tarih:", dateStr); // Eğer burası undefined geliyorsa state'de deadline_date yoktur.
    if (!dateStr) return { day: "00", month: "Jan", year: "2000", urgency: 0 };

    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const urgency = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: months[date.getMonth()],
      year: date.getFullYear(),
      urgency: urgency,
    };
  };

  const sortedDeadlineTasks = [...deadlineTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return new Date(a.deadline_date) - new Date(b.deadline_date);
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
                    <span className="plus">+</span>
                  </button>
                </div>
              </div>
              <div className="task_type_body" id="single_tasks_container">
                {isAdding && (
                  <AddSingleTaskInput
                    onCancel={() => setIsAdding(false)}
                    onSave={handleSave}
                  />
                )}
                {sortedSingleTasks.map((task) => (
                  <TaskItem
                    key={task.id} // Index yerine benzersiz ID
                    title={task.title}
                    isCompleted={task.isCompleted}
                    onToggle={() => toggleSingleTask(task.id)}
                    onDelete={() => deleteSingleTask(task.id)}
                  />
                ))}
              </div>
            </div>
            <div className="task_type">
              <div className="task_type_head">
                <h3>Has Deadline</h3>
                <div className="add_btn_container">
                  <button
                    className="add_btn"
                    onClick={() => setIsAddingDeadline(true)}
                  >
                    <span className="plus">+</span>
                  </button>
                </div>
              </div>

              {isAddingDeadline && (
                <AddDeadlineTaskInput
                  onCancel={() => setIsAddingDeadline(false)}
                  onSave={handleSaveDeadline}
                />
              )}

              <div className="timeline-wrapper">
                {sortedDeadlineTasks.map((task) => {
                  const dateParts = parseDeadlineDate(task.deadline_date);
                  return (
                    <DeadlineTaskItem
                      key={task.id}
                      title={task.title}
                      day={dateParts.day}
                      month={dateParts.month}
                      year={dateParts.year}
                      urgency={dateParts.urgency}
                      is_completed={task.isCompleted}
                      onToggle={() => toggleDeadlineTask(task.id)}
                      onDelete={() => deleteDeadlineTask(task.id)}
                    />
                  );
                })}
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
