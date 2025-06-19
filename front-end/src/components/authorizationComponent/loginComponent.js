import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import { useNavigate, Link } from 'react-router-dom';
import "./authComponent.css"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try 
        {
            const response = await axiosInstance.post(
                '/auth/login',
                { username, password }
            );

            const role = response.data.data.role;

            if (role === 'admin') 
            {
                navigate('/admin/home');
            } else if (role === 'og')
            {
                navigate('/og/home');
            } else if (role === 'moderator')
            {
                navigate('/mod/home');
            } else if (role === 'npc')
            {
                navigate('/npc/home');
            } else 
            {
                setError('Unknown user role.');
            }
        } catch (err) 
        {
            setError(err.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Welcome Back</h2>
                {error && <p className="error-message">{error}</p>}

                <label htmlFor="username" className="input-label">Username</label>
                <input
                    id="username"
                    type="text"
                    className="login-input"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password" className="input-label">Password</label>
                <div className="password-wrapper">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="login-input"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="show-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? 'hide' : 'show'}
                    </button>
                </div>

                <button type="submit" className="login-submit-btn">Login</button>

                <p className="register-link">
                    No account? <Link to="/register">Register here!</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
