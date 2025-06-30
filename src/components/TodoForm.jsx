import React, { useState, useEffect } from 'react';

const TodoForm = ({ onSubmit, todoToEdit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (todoToEdit) {
            setTitle(todoToEdit.title);
            setDescription(todoToEdit.description);
            setDueDate(todoToEdit.dueDate ? todoToEdit.dueDate.slice(0, 10) : '');
        } else {
            setTitle('');
            setDescription('');
            setDueDate('');
        }
    }, [todoToEdit]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!title || !description || !dueDate) return;
        onSubmit({ title, description, dueDate });
        if (!todoToEdit) {
            setTitle('');
            setDescription('');
            setDueDate('');
        }
    };

    return (
        <form onSubmit={submitHandler} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <br />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <br />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
            />
            <br />
            <button type="submit">{todoToEdit ? 'Update' : 'Add'} Todo</button>
            {todoToEdit && (
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ marginLeft: 10, backgroundColor: '#b2bec3' }}
                >
                    Cancel
                </button>
            )}
        </form>
    );
};

export default TodoForm;
