import "../styles/DeadlineTaskItem.css";

function DeadlineTaskItem({
  title,
  subtitle,
  day,
  month,
  year,
  urgency,
  is_completed,
  onToggle,
  onDelete,
}) {
  const getUrgencyClass = () => {
    if (urgency <= 3) return "critical";
    if (urgency <= 14) return "warning";
    return "safe";
  };

  return (
    <div className={`deadline-item ${is_completed ? "is-completed" : ""}`}>
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

      <div className="task-body">
        <div className="task-info">
          <span className="task-title">{title}</span>
          {subtitle && <span className="task-subtitle">{subtitle}</span>}
          {!is_completed && urgency !== undefined && (
            <span className={`urgency-badge ${getUrgencyClass()}`}>
              <span className="urgency-dot"></span>
              {urgency} days left
            </span>
          )}
        </div>

        <div className="date-block">
          <span className="date-day">{day}</span>
          <div className="date-month-year">
            <span className="date-month">{month}</span>
            <span className="date-separator"></span>
            <span className="date-year">{year}</span>
          </div>
        </div>
      </div>

      <button className="delete-btn" onClick={onDelete} type="button">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}

export default DeadlineTaskItem;
