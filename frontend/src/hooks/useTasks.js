import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  fetchAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasks";

export function useTasks() {
  // ─────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────
  const [singleTasks, setSingleTasks] = useState([]);
  const [deadlineTasks, setDeadlineTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingDeadline, setIsAddingDeadline] = useState(false);

  // ─────────────────────────────────────────
  // LOAD
  // ─────────────────────────────────────────
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchAllTasks();

      const singles = data
        .filter((t) => t.task_type === "single" || !t.task_type)
        .map((t) => ({
          ...t,
          isCompleted: t.is_completed,
          createdAt: t.created_at,
        }));

      const deadlines = data
        .filter((t) => t.task_type === "deadline")
        .map((t) => ({
          ...t,
          isCompleted: t.is_completed,
          deadline_date: t.deadline_date,
          createdAt: t.created_at,
        }));

      setSingleTasks(singles);
      setDeadlineTasks(deadlines);
    } catch (err) {
      console.error("Tasklar yüklenemedi:", err);
    }
  };

  // ─────────────────────────────────────────
  // SINGLE
  // ─────────────────────────────────────────
  const handleAddSingle = async (title) => {
    if (title.trim().length < 3) return;
    try {
      const saved = await createTask({
        id: uuidv4(),
        title: title.trim(),
        task_type: "single",
        is_completed: false,
        created_at: Date.now(),
      });
      setSingleTasks((prev) => [
        ...prev,
        {
          ...saved,
          isCompleted: saved.is_completed,
          createdAt: saved.created_at,
        },
      ]);
      setIsAdding(false);
    } catch (err) {
      console.error("Single task eklenemedi:", err);
    }
  };

  const handleToggleSingle = async (id) => {
    const task = singleTasks.find((t) => t.id === id);
    const newStatus = !task.isCompleted;
    const completedAt = newStatus ? Date.now() : null;
    try {
      await updateTask(id, {
        is_completed: newStatus,
        completed_at: completedAt,
      });
      setSingleTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, isCompleted: newStatus, completed_at: completedAt }
            : t,
        ),
      );
    } catch (err) {
      console.error("Single toggle hatası:", err);
    }
  };

  const handleUpdateSingle = async (id, newTitle) => {
    if (newTitle.trim().length < 3) return;
    try {
      const updated = await updateTask(id, { title: newTitle.trim() });
      setSingleTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: updated.title } : t)),
      );
    } catch (err) {
      console.error("Task güncellenemedi:", err);
      alert("Başlık güncellenirken hata oluştu.");
    }
  };

  const handleDeleteSingle = async (id) => {
    try {
      await deleteTask(id);
      setSingleTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Single silme hatası:", err);
    }
  };

  // ─────────────────────────────────────────
  // DEADLINE
  // ─────────────────────────────────────────
  const handleAddDeadline = async (deadlineData) => {
    try {
      const newTask = {
        id: uuidv4(),
        title: deadlineData.title,
        deadline_date: deadlineData.date,
        task_type: "deadline",
        is_completed: false,
        created_at: Date.now(),
      };
      const saved = await createTask(newTask);
      setDeadlineTasks((prev) => [
        ...prev,
        { ...newTask, ...saved, isCompleted: false, task_type: "deadline" },
      ]);
      setIsAddingDeadline(false);
    } catch (err) {
      console.error("Deadline task eklenemedi:", err);
    }
  };

  const handleToggleDeadline = async (id) => {
    const task = deadlineTasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = !task.isCompleted;
    const completedAt = newStatus ? Date.now() : null;
    try {
      const updated = await updateTask(id, {
        is_completed: newStatus,
        completed_at: completedAt,
      });
      setDeadlineTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                ...updated,
                isCompleted: updated.is_completed ?? newStatus,
                completed_at: completedAt,
              }
            : t,
        ),
      );
    } catch (err) {
      console.error("Deadline toggle hatası:", err);
    }
  };

  const handleUpdateDeadline = async (id, newTitle) => {
    if (newTitle.trim().length < 3) return;
    try {
      const updated = await updateTask(id, { title: newTitle.trim() });
      setDeadlineTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: updated.title } : t)),
      );
    } catch (err) {
      console.error("Task güncellenemedi:", err);
      alert("Başlık güncellenirken hata oluştu.");
    }
  };

  const handleDeleteDeadline = async (id) => {
    try {
      await deleteTask(id);
      setDeadlineTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Deadline silme hatası:", err);
    }
  };

  // ─────────────────────────────────────────
  // SORT
  // ─────────────────────────────────────────
  const sortedSingleTasks = [...singleTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return a.createdAt - b.createdAt;
  });

  const sortedDeadlineTasks = [...deadlineTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return new Date(a.deadline_date) - new Date(b.deadline_date);
  });

  // ─────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────
  return {
    singleTasks: sortedSingleTasks,
    deadlineTasks: sortedDeadlineTasks,
    isAdding,
    setIsAdding,
    isAddingDeadline,
    setIsAddingDeadline,
    handleAddSingle,
    handleAddDeadline,
    handleUpdateSingle,
    handleUpdateDeadline,
    handleToggleSingle,
    handleToggleDeadline,
    handleDeleteSingle,
    handleDeleteDeadline,
  };
}
