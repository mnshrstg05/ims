import React, { useState } from 'react';
import loginImg from '../images/warehouse-management-software.png';
import logoImg from '../images/logo.webp'
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
            const response = await axios.post('http://localhost:5000/users/login', { username, password });
    
            if (response.data.token) {
                sessionStorage.setItem('authToken', response.data.token);
                sessionStorage.setItem('username', username);
                setIsAuthenticated(true);
                navigate('/dashboard');
            }
        } catch (err) {
            // console.log(err.response.data);  // Log the full error response for debugging
            setError('Invalid username or password');
        }
    };
    

    return (
        <div>
            <div className='fixed w-screen py-4 px-2 bg-gray-900 text-white flex justify-between'>
                <div className='container mx-auto flex items-center'>
                    <h1 className="text-2xl md:text-4xl font-semibold">Inventory System</h1>
                </div>
            </div>

            {/* Flexbox container for image and form */}
            <div className="flex flex-col sm:flex-row h-screen">
                {/* Left section with image */}
                <div className="w-full sm:w-1/2 bg-gray-200 flex justify-center items-center p-4">
                    <img src={loginImg} alt="Login" className="w-full sm:max-w-none sm:h-full object-cover" />
                </div>

                {/* Right section with form */}
                <div className="w-full sm:w-1/2 flex justify-center items-center p-4">
                    <div className="w-full sm:w-3/4 max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-center">
  <div className="bg-teal-500 rounded-full p-1 mb-4">
    <img 
      src={logoImg} 
      alt="Login" 
      className="h-20 w-56 object-cover rounded" 
    />
  </div>
</div>


                        <h2 className="text-2xl font-bold text-gray-500 mb-6 text-center">User Login</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Username input */}
                            <div className="flex items-center border rounded-lg">
                                <span className="px-3">
                                    <i className="fa fa-user text-gray-500"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full py-3 px-4 outline-none"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"  // Added autocomplete attribute
                                />
                            </div>

                            {/* Password input */}
                            <div className="flex items-center border rounded-lg">
                                <span className="px-3">
                                    <i className="fa fa-lock text-gray-500"></i>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full py-3 px-4 outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"  // Added autocomplete attribute
                                />
                            </div>

                            {/* Login button */}
                            <button type="submit" className="w-full py-3 bg-blue-400 hover:bg-green-600 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                                Login
                            </button>

                            {/* Sign Up link with margin */}
                            <div className="text-center mt-4">
                                <a href='/signup'>
                                    <span className="text-blue-500 cursor-pointer">
                                        Sign Up for New User
                                    </span>
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
