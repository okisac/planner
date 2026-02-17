function TaskItem({ title, isCompleted, onToggle, onDelete }) {
  console.log(title, "tamamlandı mı?:", isCompleted);
  return (
    <div className={`task_item ${isCompleted ? "task_item--completed" : ""}`}>
      {/* Checkbox Wrapper */}
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onToggle}
          id={`task-${title}`} // Accessibility için unique ID
        />
        <svg viewBox="0 0 35.6 35.6">
          <circle className="background" cx="17.8" cy="17.8" r="17.8" />
          <circle className="stroke" cx="17.8" cy="17.8" r="14.37" />
          <polyline
            className="check"
            points="11.78 18.12 15.55 22.23 25.17 12.87"
          />
        </svg>
      </div>

      {/* Görev İçeriği */}
      <div className="task_content">
        <div className="task_title">
          <span>{title}</span>
        </div>
      </div>

      {/* Silme Butonu */}
      <button
        className="delete-btn"
        onClick={onDelete}
        aria-label={`${title} görevini sil`}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
  );
}

export default TaskItem;
