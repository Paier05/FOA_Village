import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiMenu,
    FiChevronLeft,
    FiHome,
    FiBox,
    FiRepeat,
    FiInfo,
    FiZap,
    FiMap,
    FiUsers,
    FiFlag
} from 'react-icons/fi';
import './sidebars.css';

const NPCSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setCollapsed(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setCollapsed(prev => !prev);

    return (
        <>
            <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {!collapsed && <h2 className="sidebar-title">NPC Panel</h2>}
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/npc/home" className="sidebar-link">
                        <FiHome className="sidebar-icon" />
                        {!collapsed && 'Home'}
                    </NavLink>
                    <hr className="sidebar-divider" />
                    <NavLink to="/npc/oginfo" className="sidebar-link">
                        <FiInfo className="sidebar-icon" />
                        {!collapsed && 'OG Info'}
                    </NavLink>
                    <NavLink to="/npc/granteff" className="sidebar-link">
                        <FiZap className="sidebar-icon" />
                        {!collapsed && 'Grant Effects'}
                    </NavLink>
                    <NavLink to="/npc/useeff" className="sidebar-link">
                        <FiRepeat className="sidebar-icon" />
                        {!collapsed && 'Use Effects'}
                    </NavLink>
                    <NavLink to="/npc/devland" className="sidebar-link">
                        <FiMap className="sidebar-icon" />
                        {!collapsed && 'Dev Land'}
                    </NavLink>
                    <NavLink to="/npc/trainarmy" className="sidebar-link">
                        <FiUsers className="sidebar-icon" />
                        {!collapsed && 'Army'}
                    </NavLink>
                    <NavLink to="/npc/battleoc" className="sidebar-link">
                        <FiFlag className="sidebar-icon" />
                        {!collapsed && 'War Outcome'}
                    </NavLink>
                </nav>
            </div>

            {/* Toggle button OUTSIDE the sidebar */}
            <button
                className={`sidebar-toggle-btn ${collapsed ? 'collapsed' : ''}`}
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                {collapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
            </button>
        </>
    );
};

export default NPCSidebar;
