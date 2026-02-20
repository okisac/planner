function TaskItem({ title, isCompleted, onToggle, onDelete }) {
  return (
    <div className={`task_item ${isCompleted ? "task_item--completed" : ""}`}>
      <div className="timeline-node" onClick={onToggle}>
        <div className="node-visual">
          <div className="node-inner"></div>
          <svg className="checkmark" width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M3 8.5L6.5 12L13 5"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="task_content">
        <div className="task_title">
          <span>{title}</span>
        </div>
        <div className="delete-btn-wrapper-single">
          <button
            className="delete-btn-single"
            onClick={onDelete}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
