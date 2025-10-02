
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCopy, FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  username: string;
}

const SettingsScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          router.push('/');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleCopy = () => {
    if (user) {
      navigator.clipboard.writeText(user._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#075E54] text-white p-4 flex items-center">
        <Link href="/home">
          <FiArrowLeft size={24} className="mr-4" />
        </Link>
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>
      <div className="p-4 space-y-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {user && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Your User ID</h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-mono truncate">{user._id}</p>
              <button onClick={handleCopy} className="flex items-center space-x-2 text-blue-500">
                <FiCopy />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white p-3 rounded-lg shadow-md">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
