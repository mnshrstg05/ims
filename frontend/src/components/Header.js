import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ setIsAuthenticated, onToggleMobileNav }) => {
    const [username, setUsername] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownTimer, setDropdownTimer] = useState(null);
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

    useEffect(() => {
        return () => {
            if (dropdownTimer) clearTimeout(dropdownTimer);
        };
    }, [dropdownTimer]);

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        setIsAuthenticated(false);
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
        if (!dropdownVisible) {
            const timer = setTimeout(() => setDropdownVisible(false), 3000);
            setDropdownTimer(timer);
        } else {
            clearTimeout(dropdownTimer);
        }
    };

    const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
        setDropdownVisible(false);
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const closePasswordModal = () => setIsPasswordModalOpen(false);

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
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Password changed successfully! Please log in again.');
                setTimeout(() => {
                    closePasswordModal();
                    handleLogout();
                }, 2500);
            } else {
                setError(data.message || 'Failed to change password.');
            }
        } catch (err) {
            setError('An error occurred while changing the password.');
        }
    };

    return (
        <>
            <header className="
                text-white px-4 py-4 flex justify-between items-center shadow-md sticky top-0 z-50
                bg-gradient-to-r from-teal-400 via-white-200 to-teal-600
                md:bg-gradient-to-r md:from-gray-400 md:via-white-200 md:to-gray-300
            ">
                <div className="flex items-center gap-3">
                    <button className="md:hidden text-2xl" onClick={onToggleMobileNav}>☰</button>
                    <h1 className="text-lg sm:text-xl font-semibold uppercase tracking-wide">
                        Welcome {username ? `${username.toUpperCase()} 😊` : 'Guest'}
                    </h1>
                </div>

                <div className="relative">
                    <div
                        onClick={toggleDropdown}
                        className="w-10 h-10 rounded-full border-2 border-white bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer hover:bg-white/30 transition"
                    >
                        {username ? username.charAt(0).toUpperCase() : 'G'}
                    </div>

                    {dropdownVisible && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 border rounded-lg shadow-lg z-50 animate-fade-in">
                            <ul className="p-2 space-y-1">
                                <li onClick={openPasswordModal} className="py-2 px-4 hover:bg-gray-100 cursor-pointer rounded">Change Password</li>
                                <li onClick={handleLogout} className="py-2 px-4 hover:bg-red-100 text-red-600 cursor-pointer rounded">Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-96 max-w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form autoComplete="on">
                            <input type="text" value={username} readOnly hidden autoComplete="username" />
                            <div className="mb-4">
                                <label className="block text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
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
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button onClick={closePasswordModal} className="bg-gray-300 py-2 px-4 rounded-md">Cancel</button>
                                <button onClick={handleChangePassword} className="bg-blue-500 text-white py-2 px-4 rounded-md">Change Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
