import { useState } from "react";
import "./App.css";
import SingleTaskItem from "./components/single/SingleTaskItem";
import DeadlineTaskItem from "./components/deadline/DeadlineTaskItem";
import AddSingleTaskInput from "./components/single/AddSingleTaskInput";
import AddDeadlineTaskInput from "./components/deadline/AddDeadlineTaskInput";
import Navbar from "./components/Navbar";
import "./styles/TaskItem.css";
import "./styles/AddSingleTaskInput.css";
import "./styles/AddDeadlineTaskInput.css";
import "./styles/DeadlineTaskItem.css";
import "./styles/InlineEditInput.css";
import "./styles/LoginPage.css";
import { useTasks } from "./hooks/useTasks";
import { parseDeadlineDate } from "./utils/dateUtils";
import LoginPage from "./components/LoginPage";

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { username: localStorage.getItem("username") } : null;
  });

  const {
    singleTasks,
    deadlineTasks,
    isAdding,
    setIsAdding,
    isAddingDeadline,
    setIsAddingDeadline,
    handleAddSingle,
    handleAddDeadline,
    handleUpdateSingle,
    handleUpdateDeadline,
    handleToggleSingle,
    handleToggleDeadline,
    handleDeleteSingle,
    handleDeleteDeadline,
  } = useTasks(user);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <>
      <div>
        <header>
          <h1 id="app-title">Plan your daily tasks</h1>
        </header>
      </div>
      <main className="app-container">
        <div className="wrapper">
          <div className="tasks_head">
            <div className="logout">
              <Navbar />
            </div>
            <h2>Tasks</h2>
          </div>
          <div className="task_container">
            {/* SINGLE TASKS */}
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
                    onSave={handleAddSingle}
                  />
                )}
                {singleTasks.map((task) => (
                  <SingleTaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    isCompleted={task.isCompleted}
                    onToggle={() => handleToggleSingle(task.id)}
                    onDelete={() => handleDeleteSingle(task.id)}
                    onSaveEdit={(newTitle) =>
                      handleUpdateSingle(task.id, newTitle)
                    }
                  />
                ))}
              </div>
            </div>

            {/* DEADLINE TASKS */}
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
                  onSave={handleAddDeadline}
                />
              )}
              <div className="timeline-wrapper">
                {deadlineTasks.map((task) => {
                  const dateParts = parseDeadlineDate(task.deadline_date);
                  return (
                    <DeadlineTaskItem
                      key={task.id}
                      title={task.title}
                      day={dateParts.day}
                      month={dateParts.month}
                      year={dateParts.year}
                      urgency={dateParts.urgency}
                      isCompleted={task.isCompleted}
                      onToggle={() => handleToggleDeadline(task.id)}
                      onDelete={() => handleDeleteDeadline(task.id)}
                      onSaveEdit={(newTitle) =>
                        handleUpdateDeadline(task.id, newTitle)
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
