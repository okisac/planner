import "../../styles/DeadlineTaskItem.css";
import { useState, useEffect } from "react";
import InlineEditInput from "../InlineEditInput";
import DeleteButtonDeadline from "./DeleteButtonDeadline";
import EditButtonDeadline from "../deadline/EditButtonDeadline";
import "../../styles/TaskItem.css";

function DeadlineTaskItem({
  title,
  day,
  month,
  year,
  urgency,
  isCompleted,
  onToggle,
  onDelete,
  onSaveEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [showPulse, setShowPulse] = useState(true);

  const handleEditSave = async () => {
    if (tempTitle.trim().length < 3) return;
    await onSaveEdit(tempTitle);
    setIsEditing(false);
  };

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
    <div className={`deadline-item ${isCompleted ? "is-completed" : ""}`}>
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
              {!isEditing ? (
                <span
                  className="task-title"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {title}
                </span>
              ) : (
                <InlineEditInput
                  initialValue={title}
                  onChange={setTempTitle}
                  onSave={handleEditSave}
                  onCancel={() => {
                    setIsEditing(false);
                    setTempTitle(title);
                  }}
                  maxLength={32}
                />
              )}
              {!isCompleted && urgency !== undefined && (
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
                <span className="date-year">{year}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="task_actions_deadline">
          {!isCompleted && (
            <EditButtonDeadline
              isEditing={isEditing}
              onEdit={isEditing ? handleEditSave : () => setIsEditing(true)}
              tempTitle={tempTitle}
            />
          )}
          <DeleteButtonDeadline onDelete={onDelete} isCompleted={isCompleted} />
        </div>
      </div>
    </div>
  );
}

export default DeadlineTaskItem;
