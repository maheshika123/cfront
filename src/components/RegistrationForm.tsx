
"use client";

import { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email) {
      setError('Name and email are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email });
      setSuccess(`Registration successful! Your user ID is: ${response.data._id}`);
      setName('');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="bg-white text-black p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-100 border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-gray-100 border-2 border-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
          <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
