import React, { useState } from 'react';
import loginImg from '../images/warehouse-management-software.png';
import logoImg from '../images/logo.webp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://ims-3cdk.onrender.com/users/login', { username, password });

      if (response.data.token) {
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('username', username);
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <div className="fixed top-0 w-full py-4 px-4 bg-gray-900 text-white z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-center md:justify-start">
          <h1 className="text-2xl md:text-3xl font-semibold">Inventory Management System</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 flex flex-col md:flex-row min-h-[90vh] md:min-h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-200 flex justify-center items-center py-6">
          <img
            src={loginImg}
            alt="Login"
            className="w-4/5 max-w-xs md:max-w-md lg:max-w-lg object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center py-6 px-4 sm:px-8">
          <div className="w-full max-w-lg bg-gray-100 p-6 sm:p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
              <div className="bg-teal-500 rounded-full p-1 mb-4">
                <img
                  src={logoImg}
                  alt="Logo"
                  className="h-20 w-56 object-cover rounded"
                />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 text-center mb-6">
              User Login
            </h2>

            {error && (
              <p className="text-sm text-center bg-red-500 text-white p-2 rounded mb-4">
                {error}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                <i className="fa fa-user text-gray-500 mr-2"></i>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-transparent outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                <i className="fa fa-lock text-gray-500 mr-2"></i>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300 shadow-md"
              >
                Login
              </button>

              <div className="text-center mt-4">
                <a href="/signup" className="text-sm text-blue-600 hover:underline">
                  Don’t have an account? Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
