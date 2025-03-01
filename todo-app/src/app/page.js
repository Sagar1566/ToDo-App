"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching todos:", error.message);
    } else {
      setTodos(data);
    }
  };

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: newTodo, completed: false }])
      .select()
      .single();

    if (error) {
      console.error("Error adding todo:", error.message);
    } else {
      setTodos([data, ...todos]);
      setNewTodo("");
    }
  };

  // Toggle completion status
  const toggleTodo = async (id, completed) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating todo:", error.message);
    } else {
      setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
    }
  };

  // Remove a todo
  const removeTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error.message);
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  // Clear all completed todos
  const clearCompleted = async () => {
    const { error } = await supabase.from("todos").delete().eq("completed", true);

    if (error) {
      console.error("Error clearing completed todos:", error.message);
    } else {
      setTodos(todos.filter((todo) => !todo.completed));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Supabase Todo App</h1>
        
        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="flex mb-4">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-lg"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Add</button>
        </form>

        {/* Todo List */}
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 border rounded-md bg-gray-50"
            >
              <span
                className={`flex-1 cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""}`}
                onClick={() => toggleTodo(todo.id, todo.completed)}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-red-500 text-sm"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        {/* Clear Completed Todos Button */}
        <button
          onClick={clearCompleted}
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg"
        >
          Clear Completed
        </button>
      </div>
    </div>
  );
}
