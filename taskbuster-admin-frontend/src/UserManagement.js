import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './userManagement.css';

const UserManagement = ({ admin, setIsLoggedIn, setAdmin }) => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [editUserId, setEditUserId] = useState(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/all');
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError('Failed to fetch users.');
        }
    };

    const handleAddOrUpdateUser = async (e) => {
        e.preventDefault();
        const user = { name, email, password, admin: { adminId: admin.adminId } };

        try {
            if (editUserId) {
                await axios.put(`http://localhost:8080/api/user/putUser/${editUserId}`, user);
            } else {
                await axios.post('http://localhost:8080/api/user/create', user);
            }
            resetForm();
            fetchUsers();
        } catch (err) {
            console.error("Error adding/updating user:", err);
            setError('Failed to save user.');
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setEditUserId(null);
        setError('');
    };

    const handleEditUser = (user) => {
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
        setEditUserId(user.userId);
    };

    const handleDeleteUser = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8080/api/user/delete/${id}`);
                window.alert("User deleted");
                fetchUsers();
            } catch (err) {
                console.error("Error deleting user:", err);
                setError('Failed to delete user.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin');
        setIsLoggedIn(false);
        setAdmin(null);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Navbar for Admin Info and Logout */}
            <nav className="navbar">
                <div className="admin-info">
                    <p><strong>Admin Name:</strong> {admin.name}</p>
                    <p><strong>Email:</strong> {admin.email}</p>
                    <p><strong>ID:</strong> {admin.adminId}</p>
                </div>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>

            {/* User Management Container */}
            <div className="user-management-container">
                <h2>User Management</h2>
                <div className="top-bar">
                    <input
                        type="text"
                        placeholder="Search User"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="reset-form-button" onClick={resetForm}>
                        Reset Form
                    </button>
                </div>

                <form className="user-form" onSubmit={handleAddOrUpdateUser}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className="apply-button">
                        {editUserId ? 'Apply Changes' : 'Add User'}
                    </button>
                    {editUserId && (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </form>

                {error && <p className="error-message">{error}</p>}

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.userId}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td className="action-buttons">
                                    <button className="edit-button" onClick={() => handleEditUser(user)}>Edit</button>
                                    <button className="delete-button" onClick={() => handleDeleteUser(user.userId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
