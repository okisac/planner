import React, { useState, useEffect } from "react";

const AddDeadlineTaskInput = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const isPastDate = (() => {
    if (!date) return false;
    const parsed = new Date(date);

    // 1) Geçersiz tarihse (NaN) veya yıl henüz 4 haneli değilse (örn: 0002) uyarı verme
    if (isNaN(parsed.getTime()) || parsed.getFullYear() < 1000) return false;

    // 2) Bugünle kıyasla
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return parsed < today;
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    if (title.trim().length < 3) return;

    onSave({
      title: title,
      date: date,
    });
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
    if (e.target.classList.contains("deadline-modal-overlay")) {
      onCancel();
    }
  };

  const getCounterClass = () => {
    if (title.length < 3) return "char-counter danger";
    const remaining = 32 - title.length;
    if (remaining <= 8) return "char-counter warn";
    return "char-counter";
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, date]);

  return (
    <div className="deadline-modal-overlay" onClick={handleBackdropClick}>
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
              maxLength={32}
              onKeyDown={handleKeyDown}
            />
            <span className={getCounterClass()}>{title.length}/32</span>
          </div>

          <div className="input-group">
            <label>Due Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={isPastDate ? "input-warning" : ""}
            />
            {isPastDate && (
              <span className="past-date-warning">
                ⚠ You've entered a past date
              </span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              onClick={handleSubmit}
              disabled={!title.trim() || title.trim().length < 3 || !date}
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
