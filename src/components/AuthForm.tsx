"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      if (!username || !password) {
        setError('Username and password are required');
        return;
      }
    } else {
      if (!name || !email || !username || !password) {
        setError('All fields are required');
        return;
      }
    }

    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    const payload = isLogin ? { username, password } : { name, email, username, password };

    try {
      const response = await axios.post(url, payload);
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        setSuccess('Logged in successfully!');
        router.push('/home');
      } else {
        setSuccess(`Registered successfully! Your user ID is: ${response.data._id}`);
        setName('');
        setEmail('');
        setUsername('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transform transition-transform hover:scale-105">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-6">
          {isLogin ? "Not registered?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline ml-2 font-medium">
            {isLogin ? 'Create an account' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;