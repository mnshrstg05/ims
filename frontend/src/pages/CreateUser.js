import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SignUpImg from '../images/Welcome.svg';
import logoImg from '../images/logo.webp';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      setMessageType('error');
      return;
    }

    try {
      const response = await axios.post('https://ims-3cdk.onrender.com/users', {
        username,
        password,
        email,
        role,
      });

      if (response.status === 201) {
        setMessage('User created successfully!');
        setMessageType('success');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setRole('Staff');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setMessage('Error creating user!');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <div className="fixed top-0 w-full py-4 px-4 bg-gray-900 text-white z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-center md:justify-start">
          <h1 className="text-2xl md:text-3xl font-semibold">Stock Management System</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-20 flex flex-col md:flex-row min-h-[90vh] md:min-h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-200 flex justify-center items-center py-6">
          <img
            src={SignUpImg}
            alt="Sign Up"
            className="w-4/5 max-w-xs md:max-w-md lg:max-w-lg"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center py-6 px-4 sm:px-8">
          <div className="w-full max-w-lg bg-gray-100 p-6 sm:p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
              <div className="bg-teal-500 rounded-full p-1 mb-4">
                <img 
                  src={logoImg} 
                  alt="Login" 
                  className="h-20 w-56 object-cover rounded" 
                />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 text-center mb-6">
              New User
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                <i className="fa fa-user text-gray-500 mr-2"></i>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-transparent outline-none"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                <i className="fa fa-lock text-gray-500 mr-2"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent outline-none"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                <i className="fa fa-lock text-gray-500 mr-2"></i>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full bg-transparent outline-none"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                <i className="fa fa-envelope text-gray-500 mr-2"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-transparent outline-none"
                  required
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                <i className="fa fa-user-tag text-gray-500 mr-2"></i>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-transparent outline-none"
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300 shadow-md"
              >
                Sign Up
              </button>

              <div className="text-center mt-4">
                <a href="/login" className="text-sm text-blue-600 hover:underline">
                  Already have an account? Login
                </a>
              </div>
            </form>

            {message && (
              <div
                className={`mt-4 p-3 text-sm text-center rounded-lg transition-all duration-300 ${
                  messageType === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
