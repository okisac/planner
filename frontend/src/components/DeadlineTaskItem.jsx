import "../styles/DeadlineTaskItem.css";
import { useState, useEffect } from "react";

function DeadlineTaskItem({
  title,
  day,
  month,
  year,
  urgency,
  is_completed,
  onToggle,
  onDelete,
}) {
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  const formatDays = (value) => {
    return Math.abs(value) === 1 ? "day" : "days";
  };

  const getUrgencyDisplay = () => {
    if (urgency === 0) return "Today ";
    if (urgency < 0)
      return `Overdue (${Math.abs(urgency)} ${formatDays(urgency)}) ⚠️`;
    return `${urgency} ${formatDays(urgency)} left`;
  };

  const getUrgencyClass = () => {
    if (urgency < 0) return "overdue";
    if (urgency === 0 || urgency <= 2) return "critical";
    if (urgency <= 5) return "warning";
    return "safe";
  };

  return (
    <div className={`deadline-item ${is_completed ? "is-completed" : ""}`}>
      <div className="timeline-node-deadline" onClick={onToggle}>
        <div className="timeline-line"></div> {/* ← Çizgi artık burada */}
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
          <div className="task-main-row">
            <div className="task-text-group">
              <span className="task-title">{title}</span>
              {!is_completed && urgency !== undefined && (
                <span className={`urgency-badge ${getUrgencyClass()}`}>
                  <span
                    className={`urgency-dot ${showPulse ? "pulse-once" : ""}`}
                  ></span>
                  {getUrgencyDisplay()}
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
        </div>

        <div className="delete-btn-wrapper-deadline">
          <button
            className="delete-btn-deadline"
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

export default DeadlineTaskItem;
