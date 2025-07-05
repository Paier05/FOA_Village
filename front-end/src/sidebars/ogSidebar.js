import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiChevronLeft, FiHome, FiBox, FiRepeat, FiLogOut, FiInfo } from 'react-icons/fi';
import './sidebars.css';
import axiosInstance from '../api/axiosInstance';

const OGSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const toggleSidebar = () => setCollapsed(prev => !prev);

    return (
        <>
            <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {!collapsed && <h2 className="sidebar-title">OG 控制板</h2>}
                </div>

                <nav className="sidebar-nav">
                    <button className="sidebar-link logout-btn" onClick={handleLogout}>
                        <FiLogOut className="sidebar-icon logout-icon" />
                        {!collapsed && '登出账号'}
                    </button>
                    <hr className="sidebar-divider" />
                    <NavLink to="/og/home" className="sidebar-link">
                        <FiHome className="sidebar-icon" />
                        {!collapsed && '主页'}
                    </NavLink>
                    <hr className="sidebar-divider" />
                    <NavLink to="/og/gamerule" className="sidebar-link">
                        <FiInfo className="sidebar-icon" />
                        {!collapsed && '游戏规则'}
                    </NavLink>
                    <NavLink to="/og/resources" className="sidebar-link">
                        <FiBox className="sidebar-icon" />
                        {!collapsed && '库存'}
                    </NavLink>
                    <NavLink to="/og/trade" className="sidebar-link">
                        <FiRepeat className="sidebar-icon" />
                        {!collapsed && '进行交易'}
                    </NavLink>
                </nav>
            </div>

            {/* Toggle button OUTSIDE the sidebar */}
            <button
                className={`sidebar-toggle-btn ${collapsed ? 'collapsed' : ''}`}
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                {collapsed ? <FiMenu /> : <FiChevronLeft />}
            </button>
        </>
    );
};

export default OGSidebar;
