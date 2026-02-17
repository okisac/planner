import React, { useState } from "react";

function AddTaskInput({ onSave, onCancel }) {
  const [taskText, setTaskText] = useState("");

  const handleSave = () => {
    if (taskText.trim()) {
      onSave(taskText.trim()); // Burada App.jsx'teki fonksiyonu tetikliyor
      setTaskText(""); // Kendi state'ini temizliyor
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
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
          placeholder="Yeni görev yaz..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            İptal
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={!taskText.trim()}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskInput;
