import { useState } from "react";
import InlineEditInput from "../InlineEditInput";
import DeleteButtonSingle from "./DeleteButtonSingle";
import EditButtonSingle from "./EditButtonSingle";
import "../../styles/TaskItem.css";

function SingleTaskItem({
  title,
  isCompleted,
  onToggle,
  onDelete,
  onSaveEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleEditSave = async () => {
    if (tempTitle.trim().length < 3) return;
    await onSaveEdit(tempTitle);
    setIsEditing(false);
  };

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
          {!isEditing ? (
            <span onDoubleClick={() => setIsEditing(true)}>{title}</span>
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
        </div>

        <div className="task_actions">
          {!isCompleted && (
            <EditButtonSingle
              isEditing={isEditing}
              onEdit={isEditing ? handleEditSave : () => setIsEditing(true)}
              tempTitle={tempTitle}
            />
          )}
          <DeleteButtonSingle onDelete={onDelete} isCompleted={isCompleted} />
        </div>
      </div>
    </div>
  );
}

export default SingleTaskItem;
