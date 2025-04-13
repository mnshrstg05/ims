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

    const handleLogout = () => {
        localStorage.clear(); // removes everything
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userId');
        setIsAuthenticated(false); // This triggers rerender and shows login page
        navigate('/login');
    };
    

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
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
            // console.log('No token found');
            setError('You are not authorized. Please log in again.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/users/change-password', {
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
                handleLogout(); // Force logout after password change
            } else {
                setError(data.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while changing the password.');
        }
    };

    return (
        <header className="bg-gray-200 px-4 py-6 flex justify-between items-center">
            <div className="logo">
            <h1 className="text-3xl text-gray-600 upercase font-bold">
    Welcome {username ? `${username.toUpperCase()} 😊` : 'Guest'}
</h1>

            </div>

            <div className="relative">
                <div
                    onClick={toggleDropdown}
                    className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center cursor-pointer"
                >
                    {username ? username.charAt(0).toUpperCase() : 'G'}
                </div>

                {dropdownVisible && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <ul className="p-2">
                            <li
                                onClick={openPasswordModal}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                            >
                                Change Password
                            </li>
                            <li
                                onClick={handleLogout}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-red-500"
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-96 max-w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form autoComplete="on">
    {/* Hidden username field for accessibility and password managers */}
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
            placeholder="Enter your current password"
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
            placeholder="Enter your new password"
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
            placeholder="Confirm your new password"
            autoComplete="new-password"
        />
    </div>
    <div className="flex justify-between">
        <button
            type="button"
            onClick={closePasswordModal}
            className="bg-gray-300 py-2 px-4 rounded-md"
        >
            Cancel
        </button>
        <button
            type="button"
            onClick={handleChangePassword}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
            Change Password
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
