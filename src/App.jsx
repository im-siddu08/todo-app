import { useEffect, useState } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, text: "Learn React basics", completed: false },
  { id: 2, text: "Build my first application", completed: true },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("my-tasks");
      return saved === null ? initialTasks : JSON.parse(saved);
    } catch {
      return initialTasks;
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("my-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();

    const text = input.trim();

    if (!text) return;

    setTasks((previous) => [
      ...previous,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ]);

    setInput("");
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  }

  function clearCompleted() {
    setTasks((previous) =>
      previous.filter((task) => !task.completed)
    );
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  return (
    <main className="app">
      <header className="app-header">
        <div className="logo" aria-label="Tasks logo">
          <svg
            viewBox="0 0 24 24"
            width="34"
            height="34"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12.5L10 17L20 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1>My Tasks</h1>
        <p className="subtitle">Plan your day. Make progress.</p>
      </header>

      <section className="task-card">
        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What do you need to do?"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-label="Enter a new task"
            maxLength={200}
          />

          <button className="add-button" type="submit">
            + Add
          </button>
        </form>

        <div className="task-stats">
          <span>{remainingCount} remaining</span>
          <span>{completedCount} completed</span>
        </div>

        <nav className="filters" aria-label="Task filters">
          {["All", "Active", "Completed"].map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-button ${
                filter === item ? "selected" : ""
              }`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                className={`task-item ${
                  task.completed ? "completed" : ""
                }`}
                key={task.id}
              >
                <label className="task-label">
                  <input
                    className="task-checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />

                  <span className="task-text">{task.text}</span>
                </label>

                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.text}`}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                {filter === "Completed" ? "✓" : "✦"}
              </div>

              <p>
                {filter === "All"
                  ? "No tasks yet. Add your first task!"
                  : filter === "Active"
                    ? "All caught up! No active tasks."
                    : "No completed tasks yet."}
              </p>

              {filter !== "All" && (
                <button
                  className="show-all-button"
                  type="button"
                  onClick={() => setFilter("All")}
                >
                  Show all tasks
                </button>
              )}
            </div>
          )}
        </div>

        <footer className="card-footer">
          <span>
            {tasks.length}{" "}
            {tasks.length === 1 ? "total task" : "total tasks"}
          </span>

          <button
            className="clear-button"
            type="button"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear completed
          </button>
        </footer>
      </section>

      <footer className="page-footer">
        Small steps every day lead to big results.
      </footer>
    </main>
  );
}

export default App;