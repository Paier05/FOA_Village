import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiChevronLeft, FiHome, FiBox, FiRepeat } from 'react-icons/fi';
import './sidebars.css';

const OGSidebar = () => {
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
                    {!collapsed && <h2 className="sidebar-title">OG Panel</h2>}
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/og/home" className="sidebar-link">
                        <FiHome className="sidebar-icon" />
                        {!collapsed && 'Home'}
                    </NavLink>
                    <hr className="sidebar-divider" />
                    <NavLink to="/og/resources" className="sidebar-link">
                        <FiBox className="sidebar-icon" />
                        {!collapsed && 'Inventory'}
                    </NavLink>
                    <NavLink to="/og/trade" className="sidebar-link">
                        <FiRepeat className="sidebar-icon" />
                        {!collapsed && 'Trade'}
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

export default OGSidebar;
