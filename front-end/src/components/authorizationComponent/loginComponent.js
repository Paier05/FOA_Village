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
                <h2 className="login-title">王权试炼</h2>
                {error && <p className="error-message">{error}</p>}

                <label htmlFor="username" className="input-label">用户名</label>
                <input
                    id="username"
                    type="text"
                    className="login-input"
                    placeholder="登入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password" className="input-label">密码</label>
                <div className="password-wrapper">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="login-input"
                        placeholder="登入密码"
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
                        {showPassword ? '隐藏' : '显示'}
                    </button>
                </div>

                <button type="submit" className="login-submit-btn">登入</button>

                <p className="register-link">
                    未注册账号？ <Link to="/register">点击这里注册！</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
