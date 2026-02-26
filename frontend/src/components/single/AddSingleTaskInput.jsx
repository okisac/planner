import React, { useState } from "react";

function AddSingleTaskInput({ onSave, onCancel }) {
  const [taskText, setTaskText] = useState("");

  const handleSubmit = () => {
    if (taskText.trim() && taskText.trim().length >= 2) {
      onSave(taskText.trim());
      setTaskText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleBackdropClick = (e) => {
    // sadece backdrop'a tıklanınca (kartın kendisi hariç)
    if (e.target.classList.contains("modal-backdrop")) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card">
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          maxLength={32}
        />
        <span className="char-counter">{taskText.length}/32</span>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={!taskText.trim() || taskText.trim().length < 2}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSingleTaskInput;
