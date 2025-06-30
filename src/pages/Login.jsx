import React, { useState } from 'react';
import BASE_URL from '../config/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            Navigate('/')
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={submitHandler}>
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
                <button type="submit">Login</button>
                <div className="flex justify-center items-center">
                    <p className="font-semibold text-white">If you do not have an account, <Link to='/register'><span className="text-yellow-500 font-semibold underline">Register</span></Link></p>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Login;