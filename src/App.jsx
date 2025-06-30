

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import BASE_URL from './config/api';


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [todos, setTodos] = useState([]);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/todos/get-todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : data.todos || []);
    } catch (err) {
      setError('Failed to fetch todos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate) return;

    const body = JSON.stringify({ title, description, dueDate });
    const method = todoToEdit ? 'PUT' : 'POST';
    const url = todoToEdit ? `${BASE_URL}/todos/${todoToEdit._id}` : `${BASE_URL}/todos`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      const data = await res.json();

      if (todoToEdit) {
        setTodos(todos.map((t) => (t._id === data._id ? data : t)));
        setTodoToEdit(null);
      } else {
        setTodos([...todos, data]);
      }

      setTitle('');
      setDescription('');
      setDueDate('');
    } catch {
      setError('Error saving todo');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this todo?');
    if (!confirmDelete) return;
    try {
      await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch {
      setError('Failed to delete todo');
    }
  };

  const startEdit = (todo) => {
    setTodoToEdit(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setDueDate(todo.dueDate.slice(0, 10));
  };

  const cancelEdit = () => {
    setTodoToEdit(null);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <nav>
        {token ? (
          <>
            <Link to="/">Todos</Link>
            <button onClick={logout} style={{ marginLeft: '1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            {' | '}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <div className="container">
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <Login setToken={setToken} />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/"
            element={
              token ? (
                <div>
                  <h1>TODO List</h1>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                    <button type="submit">{todoToEdit ? 'Update' : 'Add'} Todo</button>
                    {todoToEdit && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        style={{ marginLeft: 10, backgroundColor: '#b2bec3' }}
                      >
                        Cancel
                      </button>
                    )}
                  </form>

                  {error && <p className="error">{error}</p>}

                  <ul className="todo-list">
                    {todos.map((todo) => (
                      <li key={todo._id}>
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                        <p>
                          Due: {new Date(todo.dueDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="todo-actions">
                          <button onClick={() => startEdit(todo)}>Edit</button>
                          <button className="delete" onClick={() => handleDelete(todo._id)}>Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;