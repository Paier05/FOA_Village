import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiChevronLeft, FiHome, FiUsers } from 'react-icons/fi';
import './sidebars.css';

const AdminSidebar = () => {
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
                    {!collapsed && <h2 className="sidebar-title">Admin Panel</h2>}
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/admin/home" className="sidebar-link">
                        <FiHome className="sidebar-icon" />
                        {!collapsed && 'Home'}
                    </NavLink>
                    <hr className="sidebar-divider" />
                    <NavLink to="/admin/accounts" className="sidebar-link">
                        <FiUsers className="sidebar-icon" />
                        {!collapsed && 'Accounts'}
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

export default AdminSidebar;
