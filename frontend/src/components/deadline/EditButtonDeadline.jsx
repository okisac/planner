import "../../styles/EditButtonDeadline.css";

function EditButtonDeadline({ onEdit, isEditing }) {
  const handleMouseDown = (e) => {
    if (isEditing) {
      e.preventDefault();
      onEdit();
    }
  };

  return (
    <div
      className={`edit-btn-wrapper-deadline ${isEditing ? "save-mode" : ""}`}
    >
      <button
        className={`edit-btn-deadline ${isEditing ? "save-btn" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault(); // Bu satır, input'un odağını kaybetmesini (Blur) ENGELLER
          onEdit(); // Kaydetme veya Edit moduna geçme işlemini başlatır
        }}
        type="button"
      >
        {isEditing ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default EditButtonDeadline;
