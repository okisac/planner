import React, { useState } from "react";
import InlineEditInput from "./InlineEditInput";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import "../styles/TaskItem.css";

function TaskItem({
  id,
  title,
  isCompleted,
  onToggle,
  onDelete,
  onUpdateTitle,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleSave = () => {
    if (tempTitle.trim().length >= 3) {
      onUpdate(id, { title: tempTitle.trim() }); // Backend/Parent güncelleme fonksiyonun
      setIsEditing(false);
    }
  };

  return (
    <div className={`task_item ${isCompleted ? "task_item--completed" : ""}`}>
      {/* SOL: Checkbox / Node */}
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
          {!isEditing ? (
            <span onDoubleClick={() => setIsEditing(true)}>{title}</span>
          ) : (
            <InlineEditInput
              initialValue={title}
              onChange={setTempTitle} // Köprüyü kurduk
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setTempTitle(title); // İptalde eski haline dön
              }}
              maxLength={32}
            />
          )}
        </div>

        <div className="task_actions">
          {!isCompleted && (
            <EditButton
              isEditing={isEditing}
              onEdit={isEditing ? handleSave : () => setIsEditing(true)}
            />
          )}
          <DeleteButton onDelete={onDelete} isCompleted={isCompleted} />
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
