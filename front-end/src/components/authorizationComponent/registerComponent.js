import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import { useNavigate, Link } from 'react-router-dom';
import './authComponent.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }
        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        try {
            await axiosInstance.post(
                '/auth/register',
                { username, password }
            );
            alert('Registration successful!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Create Account</h2>
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
                
                <label htmlFor="confirm-password" className="input-label">Confirm Password</label>
                <div className="password-wrapper">
                    <input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        className="login-input"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="show-password-btn"
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label="Toggle confirm password visibility"
                    >
                        {showPassword ? 'hide' : 'show'}
                    </button>
                </div>

                <button type="submit" className="login-submit-btn">Register</button>

                <p className="register-link">
                    Already have an account? <Link to="/login">Sign in here!</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;