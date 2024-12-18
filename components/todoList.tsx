import axios from "axios";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const TodoList = ({ data, setData }: { data: any; setData: any }) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const editTodo = (todo: any) => {
    setIsEditable(true);
    setEditedTodo(todo);
    setError("");
  };

  const updateTodo = async () => {
    if (
      !editedTodo.title ||
      editedTodo.title.length < 3 ||
      !editedTodo.description ||
      editedTodo.description.length < 3
    ) {
      setError("Title and description must be at least 3 characters long.");
      return;
    }

    try {
      const updatedTodo = await axios.put(
        `https://todo-backend-84rz.onrender.com/api/todo/${editedTodo._id}`,
        editedTodo,
        { withCredentials: true }
      );
      setData((prevTodos: any) =>
        prevTodos.map((todo: any) =>
          todo._id === editedTodo._id ? updatedTodo.data.data : todo
        )
      );
      setIsEditable(false);
      console.log("Todo updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(
        `https://todo-backend-84rz.onrender.com/api/todo/${id}`,
        { withCredentials: true }
      );
      setData((prevTodos: any) =>
        prevTodos.filter((todo: any) => todo._id !== id)
      );
      console.log("Todo deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="overflow-x-auto mt-5">
      {data?.length > 0 ? (
        <table className="table-auto w-full border-collapse ">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b border-gray-400 p-2">Title</th>
              <th className="border-b border-gray-400 p-2">Description</th>
              <th className="border-b border-gray-400 p-2">Status</th>
              <th className="border-b border-gray-400 p-2">Priority</th>
              <th className="border-b border-gray-400 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((todo: any, index: number) => (
              <tr key={todo._id} className="even:bg-gray-50">
                <td className="border-b border-gray-400 p-2">
                  <input
                    required
                    type="text"
                    className={`text-xl w-full border-none focus:outline-none ${
                      isEditable && editedTodo?._id === todo._id
                        ? "border-b"
                        : ""
                    }`}
                    readOnly={!isEditable || editedTodo?._id !== todo._id}
                    value={
                      isEditable && editedTodo?._id === todo._id
                        ? editedTodo.title
                        : todo.title
                    }
                    onChange={(e) =>
                      setEditedTodo({ ...editedTodo, title: e.target.value })
                    }
                  />
                </td>
                <td className="border-b border-gray-400 ">
                  <input
                    required
                    type="text"
                    className="w-full border-none focus:outline-none text-center"
                    readOnly={!isEditable || editedTodo?._id !== todo._id}
                    value={
                      isEditable && editedTodo?._id === todo._id
                        ? editedTodo.description
                        : todo.description
                    }
                    onChange={(e) =>
                      setEditedTodo({
                        ...editedTodo,
                        description: e.target.value,
                      })
                    }
                  />
                </td>

                <td className="border-b border-gray-400 p-2 text-center">
                  {!isEditable ? (
                    <p
                      className={`rounded-md p-1 capitalize ${
                        todo.status === "pending"
                          ? "bg-yellow-300"
                          : "bg-green-300"
                      }`}
                    >
                      {todo.status}
                    </p>
                  ) : (
                    <select
                      value={
                        isEditable && editedTodo?._id === todo._id
                          ? editedTodo.status
                          : todo.status
                      }
                      onChange={(e) =>
                        setEditedTodo({ ...editedTodo, status: e.target.value })
                      }
                      disabled={!isEditable || editedTodo?._id !== todo._id}
                      className="border-none focus:outline-none w-full"
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                    </select>
                  )}
                </td>

                <td className="border-b border-gray-400 p-2 text-center">
                  {!isEditable ? (
                    <div className="flex items-center justify-center gap-x-3 px-5 ">
                      <p className="capitalize">{todo.priority}</p>
                      {todo.priority === "high" ? (
                        <span className="text-green-600 border rounded-full p-1 px-3">
                          &#8607;
                        </span>
                      ) : todo.priority === "medium" ? (
                        <span className="text-yellow-600 border rounded-full p-1 px-3">
                          &#8608;
                        </span>
                      ) : (
                        <span className="text-red-600 border rounded-full p-1 px-3">
                          &#8609;
                        </span>
                      )}
                    </div>
                  ) : (
                    <select
                      value={
                        isEditable && editedTodo?._id === todo._id
                          ? editedTodo.priority
                          : todo.priority
                      }
                      onChange={(e) =>
                        setEditedTodo({
                          ...editedTodo,
                          priority: e.target.value,
                        })
                      }
                      disabled={!isEditable || editedTodo?._id !== todo._id}
                      className="border-none focus:outline-none w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  )}
                </td>

                <td className="border-b border-gray-400 p-2 text-center">
                  <div className="flex gap-x-2 justify-center">
                    {isEditable && editedTodo?._id === todo._id ? (
                      <button
                        onClick={updateTodo}
                        className="bg-black text-white text-xs rounded py-1 px-3"
                      >
                        Save
                      </button>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => editTodo(todo)}
                      >
                        <FaPencil />
                      </div>
                    )}
                    <div
                      className="cursor-pointer"
                      onClick={() => deleteTodo(todo._id)}
                    >
                      <FaTrash />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No todos available. Add a new one!</p>
      )}
    </div>
  );
};

export default TodoList;
