"use client";
import TodoList from "@/components/todoList";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [title, setTitle] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [priorty, setPriorty] = useState<any>("low");
  const [error, setError] = useState<string>("");

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.length < 3) {
      setError("Title must be at least 3 characters long.");
      return;

      if (!description || description.length < 3) {
        setError("Description must be at least 3 characters long.");
        return;
      }

      setError("");

      const newTodo = {
        title: title,
        description: description,
        status: "pending",
        priority: priorty,
      };

      try {
        const response = await axios.post(
          "http://localhost:5200/api/todo",
          newTodo
        );
        setTodos((prev: any) => [...prev, response.data.data]);
        setTitle("");
        setDescription("");
        setPriorty("low");
      } catch (err) {
        console.log(err);
        setError("Failed to add the todo. Please try again.");
      }
    }
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        setError("");
        const todosResponse = await axios.get("http://localhost:5200/api/todo");
        setTodos(todosResponse.data.data);
      } catch (err: any) {
        console.log(err?.message);
        setError("Failed to load todos. Please try again.");
      }
    };
    getTodos();
  }, []);

  return (
    <div className="p-4 text-center items-center justify-center">
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          className="border border-black rounded-md p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError("");
          }}
          className="border border-black rounded-md p-2 mr-2"
        />
        <select
          value={priorty}
          onChange={(e) => setPriorty(e.target.value)}
          className="border border-black rounded-md p-2 mr-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="bg-black text-white rounded py-2 px-4">
          Add
        </button>
        {error && <span className="text-red-500">{error}</span>}
      </form>
      {todos.length > 0 ? (
        <TodoList data={todos} setData={setTodos} />
      ) : (
        <p className="mt-20 text-3xl text-gray-500">
          No todos available. Add a new one!
        </p>
      )}
    </div>
  );
}
