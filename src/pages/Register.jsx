import React, { useState } from 'react';
import BASE_URL from '../config/api';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            navigate('/login')

        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={submitHandler}>
                <input
                    placeholder="Name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
                <div className="flex justify-center items-center">

                    <p className="font-semibold text-white">If you already have an account, <Link to='/login'><span className="text-yellow-500 font-semibold underline">Login</span></Link></p>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Register;