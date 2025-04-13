import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Auto-close dropdown
    useEffect(() => {
        let timer;
        if (dropdownVisible) {
            timer = setTimeout(() => setDropdownVisible(false), 5000);
        }
        return () => clearTimeout(timer);
    }, [dropdownVisible]);

    // Auto-close password modal after 10 seconds
    useEffect(() => {
        let modalTimer;
        if (isPasswordModalOpen) {
            modalTimer = setTimeout(() => {
                setIsPasswordModalOpen(false);
            }, 10000);
        }
        return () => clearTimeout(modalTimer);
    }, [isPasswordModalOpen]);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userId');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
        setDropdownVisible(false);
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };

    const handleChangePassword = async () => {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            setError('You are not authorized. Please log in again.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const response = await fetch('https://ims-3cdk.onrender.com/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Password changed successfully! Please log in again.');
                handleLogout();
            } else {
                setError(data.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while changing the password.');
        }
    };

    return (
        <header className="bg-gray-200 px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shadow-md">
            {/* Welcome message */}
            <div className="text-center md:text-left w-full md:w-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-600 uppercase font-bold">
                    Welcome {username ? `${username.toUpperCase()} 😊` : 'Guest'}
                </h1>
            </div>

            {/* Avatar and dropdown */}
            <div className="relative self-center md:self-auto">
                <div
                    onClick={toggleDropdown}
                    className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 transition"
                >
                    {username ? username.charAt(0).toUpperCase() : 'G'}
                </div>

                {dropdownVisible && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20 animate-fade-in">
                        <ul className="p-2">
                            <li
                                onClick={openPasswordModal}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                            >
                                Change Password
                            </li>
                            <li
                                onClick={handleLogout}
                                className="py-2 px-4 hover:bg-red-100 cursor-pointer text-red-500"
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
                    <div className="bg-white p-6 rounded-md w-96 max-w-full mx-4 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form autoComplete="on">
                            <input
                                type="text"
                                value={username}
                                readOnly
                                hidden
                                autoComplete="username"
                            />
                            <div className="mb-4">
                                <label className="block text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={closePasswordModal}
                                    className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleChangePassword}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                                >
                                    Change
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
