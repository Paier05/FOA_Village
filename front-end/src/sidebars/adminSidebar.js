import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiChevronLeft, FiHome, FiUsers, FiLogOut, FiRepeat, FiZap, FiMap, FiClock } from 'react-icons/fi';
import './sidebars.css';
import axiosInstance from '../api/axiosInstance';
import { MdMilitaryTech, MdWarning } from 'react-icons/md';
import { GiSpade, GiSparkles, GiStoneCrafting } from 'react-icons/gi';
import { FaBalanceScale, FaCoins } from 'react-icons/fa';

const AdminSidebar = () => {
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
                    {!collapsed && <h2 className="sidebar-title">主持人控制板</h2>}
                </div>

                <nav className="sidebar-nav">
                    <button className="sidebar-link logout-btn" onClick={handleLogout}>
                        <FiLogOut className="sidebar-icon logout-icon" />
                        {!collapsed && '登出账号'}
                    </button>
                    <hr className="sidebar-divider" />
                    <NavLink to="/admin/home" className="sidebar-link">
                        <FiHome className="sidebar-icon" />
                        {!collapsed && '主页'}
                    </NavLink>
                    <hr className="sidebar-divider" />
                    <NavLink to="/admin/accounts" className="sidebar-link">
                        <FiUsers className="sidebar-icon" />
                        {!collapsed && '账号管理'}
                    </NavLink>
                    <NavLink to="/admin/gamephase" className="sidebar-link">
                        <FiClock className="sidebar-icon" />
                        {!collapsed && '游戏阶段'}
                    </NavLink>
                    <NavLink to="/admin/events" className="sidebar-link">
                        <MdWarning className="sidebar-icon" />
                        {!collapsed && '突发事件'}
                    </NavLink>
                    <NavLink to="/admin/marketrate" className="sidebar-link">
                        <FaBalanceScale className="sidebar-icon" />
                        {!collapsed && '市场兑换率'}
                    </NavLink>
                    <NavLink to="/admin/goldexchg" className="sidebar-link">
                        <FaCoins className="sidebar-icon" />
                        {!collapsed && '金币兑换'}
                    </NavLink>
                    <NavLink to="/admin/force/addeff" className="sidebar-link">
                        <FiZap className="sidebar-icon" />
                        {!collapsed && '给予特效'}
                    </NavLink>
                    <NavLink to="/admin/useeff" className="sidebar-link">
                        <FiRepeat className="sidebar-icon" />
                        {!collapsed && '使用特效'}
                    </NavLink>
                    <NavLink to="/admin/force/effcons" className="sidebar-link">
                        <GiSparkles className="sidebar-icon" />
                        {!collapsed && '特效限制'}
                    </NavLink>
                    <NavLink to="/admin/force/setogres" className="sidebar-link">
                        <GiStoneCrafting className="sidebar-icon" />
                        {!collapsed && 'OG 资源'}
                    </NavLink>
                    <NavLink to="/admin/force/setarmy" className="sidebar-link">
                        <MdMilitaryTech className="sidebar-icon" />
                        {!collapsed && '修改军队量'}
                    </NavLink>
                    <NavLink to="/admin/force/setland" className="sidebar-link">
                        <FiMap className="sidebar-icon" />
                        {!collapsed && '已开发产地'}
                    </NavLink>
                    <NavLink to="/admin/force/setfreeland" className="sidebar-link">
                        <GiSpade className="sidebar-icon" />
                        {!collapsed && '未开发产地'}
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

export default AdminSidebar;
