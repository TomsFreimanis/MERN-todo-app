import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error", err));
  };

  const completeTodo = async (id) => {
    const response = await fetch(API_BASE + "/todo/complete/" + id);
    if (response.ok) {
      const updatedTodo = await response.json();
      setTodos((todos) =>
        todos.map((todo) => {
          if (todo._id === updatedTodo._id) {
            return updatedTodo;
          }
          return todo;
        })
      );
    }
  };

  const deleteTodo = async (id) => {
    const response = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    });
    if (response.ok) {
      setTodos((todos) => todos.filter((todo) => todo._id !== id));
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") {
      return;
    }

    const response = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    });

    if (response.ok) {
      const createdTodo = await response.json();
      setTodos((todos) => [...todos, createdTodo]);
      setNewTodo("");
    }
  };

  return (
    <div className="App">
      <h1>Welcome to my To-do app !</h1>
      <h4>my tasks</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-completed" : "")}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"> </div>
            <div className="text">{todo.text}</div>
            <div
              className="delete-todo"
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo._id);
              }}
            >
              x
            </div>
          </div>
        ))}
      </div>
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>
    </div>
  );
}

export default App;
