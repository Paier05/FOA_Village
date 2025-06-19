import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import { FaCheckCircle, FaTimesCircle, FaUserShield, FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./accountManager.css";

const AccountManager = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modal, setModal] = useState({ visible: false, message: '', onConfirm: null });

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get("/apr/accounts/retrieval");
            setUsers(response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedUser(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const showModal = (message, onConfirm) => {
        setModal({ visible: true, message, onConfirm });
    };

    const handlePromote = async (id, newRole) => {
        showModal(
            `Promote user to ${newRole.toUpperCase()}? This cannot be undone.`,
            async () => {
                try {
                    await axiosInstance.put("/apr/accounts/promotion", { id, role: newRole });
                    fetchUsers();
                } catch (error) {
                    console.error("Promotion error:", error);
                }
            }
        );
    };

    const handleValidate = async (id, newValidity) => {
        const action = newValidity ? "activate" : "deactivate";
        showModal(
            `Are you sure you want to ${action} this user? This action is irreversible.`,
            async () => {
                try {
                    await axiosInstance.put("/apr/accounts/validation", { id, validity: newValidity });
                    fetchUsers();
                } catch (error) {
                    console.error("Validation error:", error);
                }
            }
        );
    };

    const getNextPromotions = (role) => {
        const order = ["og", "moderator", "npc", "admin"];
        const index = order.indexOf(role);
        return order.slice(index + 1);
    };

    const getNextDemotions = (role) => {
        const order = ["og", "moderator", "npc", "admin"];
        const index = order.indexOf(role);
        return index > 0 ? order.slice(0, index) : [];
    };

    const getRoleStyle = (role) => {
        switch (role) {
            case "admin": return { color: "#e74c3c", fontWeight: "bold" };
            case "npc": return { color: "#e67e22", fontWeight: "bold" };
            case "moderator": return { color: "#3498db", fontWeight: "bold" };
            case "og": return { color: "#2ecc71", fontWeight: "bold" };
            default: return {};
        }
    };

    return (
        <div className="admin-table-container">
            <h2>User Accounts</h2>
            <table className="admin-user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Valid</th>
                        <th>Promote</th>
                        <th>Demote</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td style={getRoleStyle(user.role)}>{user.role}</td>
                            <td>
                                {user.valid ? <FaCheckCircle color="#2ecc71" /> : <FaTimesCircle color="#e74c3c" />}
                            </td>

                            {/* Promote */}
                            <td>
                                {user.role !== "admin" && getNextPromotions(user.role).length > 0 ? (
                                    <div className="dropdown-action">
                                    <button className="action-btn promote" onClick={() => setSelectedUser(user.id)}>
                                        <FaArrowUp /> Promote
                                    </button>
                                    {selectedUser === user.id && (
                                        <div className="dropdown-menu" ref={dropdownRef}>
                                        {getNextPromotions(user.role).map(role => (
                                            <div key={role} onClick={() => handlePromote(user.id, role)}>
                                            {role}
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                    </div>
                                ) : "-"}
                            </td>

                            {/* Demote */}
                            <td>
                                {user.role !== "admin" && user.role !== "og" && getNextDemotions(user.role).length > 0 ? (
                                    <div className="dropdown-action">
                                    <button className="action-btn demote" onClick={() => setSelectedUser(-user.id)}>
                                        <FaArrowDown /> Demote
                                    </button>
                                    {selectedUser === -user.id && (
                                        <div className="dropdown-menu" ref={dropdownRef}>
                                        {getNextDemotions(user.role).map(role => (
                                            <div key={role} onClick={() => handlePromote(user.id, role)}>
                                            {role}
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                    </div>
                                ) : "-"}
                            </td>

                            {/* Validate */}
                            <td>
                                {user.role !== "admin" ? (
                                    <button
                                        className={`action-btn ${user.valid ? "deactivate" : "activate"}`}
                                        onClick={() => handleValidate(user.id, user.valid ? 0 : 1)}
                                    >
                                        {user.valid ? <><FaTimesCircle /> Deactivate</> : <><FaCheckCircle /> Activate</>}
                                    </button>
                                ) : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modal.visible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3><FaUserShield /> Confirm Action</h3>
                        <p>{modal.message}</p>
                        <div className="modal-buttons">
                            <button onClick={() => {
                                modal.onConfirm();
                                setModal({ visible: false, message: '', onConfirm: null });
                            }} className="modal-confirm">
                                <FaCheckCircle /> Confirm
                            </button>
                            <button onClick={() => setModal({ visible: false, message: '', onConfirm: null })} className="modal-cancel">
                                <FaTimesCircle /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountManager;
