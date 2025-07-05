import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FiMenu,
    FiChevronLeft,
    FiHome,
    FiRepeat,
    FiInfo,
    FiZap,
    FiMap,
    FiFlag,
    FiLogOut
} from 'react-icons/fi';
import './sidebars.css';
import axiosInstance from '../api/axiosInstance';
import { GiSwordInStone } from 'react-icons/gi';
import { MdMilitaryTech } from 'react-icons/md';
import { FaBalanceScale, FaCoins } from 'react-icons/fa';

const NPCSidebar = () => {
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
                    {!collapsed && <h2 className="sidebar-title">NPC 控制板</h2>}
                </div>

                <nav className="sidebar-nav">
                    <button className="sidebar-link logout-btn" onClick={handleLogout}>
                        <FiLogOut className="sidebar-icon logout-icon" />
                        {!collapsed && '登出账号'}
                    </button>
                    <hr className="sidebar-divider" />
                    <NavLink to="/npc/home" className="sidebar-link">
                        <FiHome className="sidebar-icon" />
                        {!collapsed && '主页'}
                    </NavLink>
                    <hr className="sidebar-divider" />
                    <NavLink to="/npc/oginfo" className="sidebar-link">
                        <FiInfo className="sidebar-icon" />
                        {!collapsed && 'OG 资讯'}
                    </NavLink>
                    <NavLink to="/npc/marketrate" className="sidebar-link">
                        <FaBalanceScale className="sidebar-icon" />
                        {!collapsed && '市场兑换率'}
                    </NavLink>
                    <NavLink to="/npc/goldexchg" className="sidebar-link">
                        <FaCoins className="sidebar-icon" />
                        {!collapsed && '金币兑换'}
                    </NavLink>
                    <NavLink to="/npc/granteff" className="sidebar-link">
                        <FiZap className="sidebar-icon" />
                        {!collapsed && '给予特效'}
                    </NavLink>
                    <NavLink to="/npc/useeff" className="sidebar-link">
                        <FiRepeat className="sidebar-icon" />
                        {!collapsed && '使用特效'}
                    </NavLink>
                    <NavLink to="/npc/usesis" className="sidebar-link">
                        <GiSwordInStone className="sidebar-icon" />
                        {!collapsed && '使用石中剑'}
                    </NavLink>
                    <NavLink to="/npc/devland" className="sidebar-link">
                        <FiMap className="sidebar-icon" />
                        {!collapsed && '开发产地'}
                    </NavLink>
                    <NavLink to="/npc/trainarmy" className="sidebar-link">
                        <MdMilitaryTech className="sidebar-icon" />
                        {!collapsed && '训练军队'}
                    </NavLink>
                    <NavLink to="/npc/battleoc" className="sidebar-link">
                        <FiFlag className="sidebar-icon" />
                        {!collapsed && '战后结果'}
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

export default NPCSidebar;
