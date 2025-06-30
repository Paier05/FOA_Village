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
            return setError('密码长度必须至少为6！');
        }
        if (password !== confirmPassword) {
            return setError('密码不匹配，请检查多一次！');
        }

        try {
            await axiosInstance.post(
                '/auth/register',
                { username, password }
            );
            alert('成功注册账号！');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || '账号注册失败！');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">注册账号</h2>
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
                
                <label htmlFor="confirm-password" className="input-label">确认密码</label>
                <div className="password-wrapper">
                    <input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        className="login-input"
                        placeholder="登入密码"
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
                        {showPassword ? '隐藏' : '显示'}
                    </button>
                </div>

                <button type="submit" className="login-submit-btn">注册</button>

                <p className="register-link">
                    已经持有账号？ <Link to="/login">点击这里登入！</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;