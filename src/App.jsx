import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task.trim(),
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((item) => !item.completed));
  };

  const completedCount = tasks.filter(
    (item) => item.completed
  ).length;

  return (
    <div className="app">
      <div className="todo-card">
        <h1>My To-Do List</h1>
        <p className="subtitle">Organize your day, one task at a time.</p>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <div className="task-info">
          <span>Total: {tasks.length}</span>
          <span>Completed: {completedCount}</span>
        </div>

        {tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first task!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((item) => (
              <li key={item.id} className="task-item">
                <label className={item.completed ? "done" : ""}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleTask(item.id)}
                  />
                  {item.text}
                </label>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(item.id)}
                  aria-label={`Delete ${item.text}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          className="clear-btn"
          onClick={clearCompleted}
          disabled={completedCount === 0}
        >
          Clear Completed Tasks
        </button>
      </div>
    </div>
  );
}

export default App;
