import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from '../components/TodoForm';

const Dashboard = ({ token }) => {
    const [todos, setTodos] = useState([]);
    const [todoToEdit, setTodoToEdit] = useState(null);
    const [error, setError] = useState('');

    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setError('');
        try {
            const { data } = await axios.get('/api/todos', config);
            setTodos(data);
        } catch {
            setError('Failed to fetch todos');
        }
    };

    const addTodo = async (todo) => {
        setError('');
        try {
            const { data } = await axios.post('/api/todos', todo, config);
            setTodos([...todos, data]);
        } catch {
            setError('Failed to add todo');
        }
    };

    const updateTodo = async (updatedFields) => {
        setError('');
        try {
            const { data } = await axios.put(`/api/todos/${todoToEdit._id}`, updatedFields, config);
            setTodos(todos.map((t) => (t._id === data._id ? data : t)));
            setTodoToEdit(null);
        } catch {
            setError('Failed to update todo');
        }
    };

    const deleteTodo = async (id) => {
        setError('');
        try {
            await axios.delete(`/api/todos/${id}`, config);
            setTodos(todos.filter((t) => t._id !== id));
        } catch {
            setError('Failed to delete todo');
        }
    };

    const onSubmit = todoToEdit ? updateTodo : addTodo;

    return (
        <div>
            <h1>Your Todos</h1>
            <TodoForm
                onSubmit={onSubmit}
                todoToEdit={todoToEdit}
                onCancel={() => setTodoToEdit(null)}
            />

            {error && <p className="error">{error}</p>}

            {todos.length === 0 && <p>No todos yet.</p>}

            <ul className="todo-list">
                {todos?.map((todo) => (
                    <li key={todo._id}>
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                        <p>
                            Due Date:{' '}
                            {new Date(todo.dueDate).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                        <div className="todo-actions">
                            <button onClick={() => setTodoToEdit(todo)}>Edit</button>
                            <button
                                onClick={() => deleteTodo(todo._id)}
                                className="delete"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
