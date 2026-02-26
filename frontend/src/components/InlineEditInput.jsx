import { useState, useEffect, useRef } from "react";
import "../styles/InlineEditInput.css";

function InlineEditInput({
  initialValue,
  onSave,
  onCancel,
  onChange,
  maxLength = 32,
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) onChange(newValue); // Parent'a (TaskItem) haber veriyoruz
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (value.trim().length >= 3) {
        onSave(value.trim());
      } else {
        onCancel();
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleBlur = () => {
    if (value.trim() !== initialValue && value.trim().length >= 3) {
      onSave(value.trim());
    } else {
      onCancel();
    }
  };

  const getCounterClass = () => {
    const remaining = maxLength - value.length;
    if (remaining <= 0) return "edit-char-counter danger";
    if (remaining <= 8) return "edit-char-counter warn";
    return "edit-char-counter";
  };

  return (
    <div className="inline-edit-container">
      <input
        ref={inputRef}
        type="text"
        className="inline-edit-input"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        maxLength={maxLength}
      />
      <div className="char-count-2">
        <span className={getCounterClass()}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

export default InlineEditInput;
