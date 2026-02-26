import "./App.css";
// import TaskItem from "./components/TaskItem";
import SingleTaskItem from "./components/single/SingleTaskItem";
import DeadlineTaskItem from "./components/deadline/DeadlineTaskItem";
import AddSingleTaskInput from "./components/single/AddSingleTaskInput";
import AddDeadlineTaskInput from "./components/deadline/AddDeadlineTaskInput";
import "./styles/TaskItem.css";
import "./styles/AddSingleTaskInput.css";
import "./styles/AddDeadlineTaskInput.css";
import "./styles/DeadlineTaskItem.css";
import "./styles/InlineEditInput.css";
import { useTasks } from "./hooks/useTasks";
import { parseDeadlineDate } from "./utils/dateUtils";

function App() {
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
  } = useTasks();

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
