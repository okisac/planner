import "./App.css";
import TaskItem from "./components/TaskItem";
import DeadlineTaskItem from "./components/DeadlineTaskItem";

function App() {
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
              </div>
              <div className="task_type_body" id="single_tasks_container">
                <TaskItem title="Mikrowelle Al" />
                <TaskItem title="Kahve Demle" />
                <TaskItem title="Kiraz Cekirdegi Yastigi Al" />
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
            <div className="card-div">asdfsadfasdf</div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
