import React, { useState } from "react";

const AddDeadlineTaskInput = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onSave({
      title: title,
      date: date,
    });
  };

  return (
    <div className="deadline-modal-overlay">
      <div className="deadline-modal">
        <h3>New Deadline Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Task Title</label>
            <input
              type="text"
              autoFocus
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Due Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={!title || !date}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeadlineTaskInput;
