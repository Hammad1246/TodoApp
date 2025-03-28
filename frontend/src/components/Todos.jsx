import React, { useEffect, useState } from "react";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "https://todo-app-server-zeta-sage.vercel.app/api/v1/todo/getTodo",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        setTodos(data.data || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://todo-app-server-zeta-sage.vercel.app/api/v1/todo/createTodo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ description: newTodo, completed: completed }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTodos([...todos, data.data]);
        setNewTodo("");
        setCompleted(false);
      } else {
        console.error("Error adding todo:", data.message);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBtn = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://todo-app-server-zeta-sage.vercel.app/api/v1/todo/deleteTodo/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ id })
        }
      );
      const data = await response.json();
      if (response.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      } else {
        console.error("Error deleting todo:", data.message);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodoStatus = async (id, currentStatus) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://todo-app-server-zeta-sage.vercel.app/api/v1/todo/updateTodo/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ completed: !currentStatus })
        }
      );
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        setTodos(todos.map(todo => 
          todo._id === id ? { ...todo, completed: !currentStatus } : todo
        ));
      } else {
        console.error("Error updating todo:", data.message);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Your To-Do List
        </h1>
        
        <form
          onSubmit={addTodo}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full"
        >
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <input
              type="checkbox"
              name="check"
              checked={completed}
              onChange={() => setCompleted(!completed)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label className="text-gray-700 font-medium">Completed</label>
          </div>
          <input
            type="text"
            name="todo"
            placeholder="What needs to be done?"
            required={true}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : "Add Todo"}
          </button>
        </form>

        {isLoading && todos.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No tasks yet</h3>
            <p className="text-gray-500 mt-1">Add your first task above</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="group relative transition-all duration-200 hover:shadow-md"
              >
                <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${todo.completed ? 'border-green-500' : 'border-yellow-500'} flex justify-between items-center transition-all duration-200`}>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => toggleTodoStatus(todo._id, todo.completed)}
                      className={`w-6 h-6 rounded-full border ${todo.completed ? 'bg-green-100 border-green-500' : 'bg-yellow-100 border-yellow-500'} flex items-center justify-center focus:outline-none`}
                    >
                      {todo.completed && (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </button>
                    <span
                      className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                    >
                      {todo.description}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                    <button 
                      onClick={() => deleteBtn(todo._id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Todos;