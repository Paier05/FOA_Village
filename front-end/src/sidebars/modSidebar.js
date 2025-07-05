import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiChevronLeft, FiHome, FiLogOut } from 'react-icons/fi';
import { FaTrophy } from "react-icons/fa";
import './sidebars.css';
import axiosInstance from '../api/axiosInstance';

const ModSidebar = () => {
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
                    {!collapsed && <h2 className="sidebar-title">站长控制板</h2>}
                </div>

                <nav className="sidebar-nav">
                    <button className="sidebar-link logout-btn" onClick={handleLogout}>
                        <FiLogOut className="sidebar-icon logout-icon" />
                        {!collapsed && '登出账号'}
                    </button>
                    <hr className="sidebar-divider" />
                    <NavLink to="/mod/home" className="sidebar-link">
                        <FiHome className="sidebar-icon" />
                        {!collapsed && '主页'}
                    </NavLink>
                    <hr className="sidebar-divider" />
                    <NavLink to="/mod/prize" className="sidebar-link">
                        <FaTrophy className="sidebar-icon" />
                        {!collapsed && '资源奖励'}
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

export default ModSidebar;
