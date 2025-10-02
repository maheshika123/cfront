"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  username: string;
}

const NewChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addedFriends, setAddedFriends] = useState<string[]>([]);

  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://chatapp-production-22cf.up.railway.app/api/users/search?userId=${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(response.data);
      } catch (err) {
        setError('Failed to search for users');
      }

      setLoading(false);
    };

    const debounceTimeout = setTimeout(() => {
      search();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleAddFriend = async (friendId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://chatapp-production-22cf.up.railway.app/api/users/add-friend',
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddedFriends([...addedFriends, friendId]);
    } catch (err) {
      setError('Failed to add friend');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#075E54] text-white p-4 flex items-center">
        <Link href="/home">
          <FiArrowLeft size={24} className="mr-4" />
        </Link>
        <h1 className="text-xl font-semibold">New Chat</h1>
      </header>
      <div className="p-4">
        <div className="relative">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user ID..."
            className="w-full p-2 pl-10 rounded-lg bg-gray-100 border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {searchResults.map((user) => (
          <div key={user._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
            <button
              onClick={() => handleAddFriend(user._id)}
              disabled={addedFriends.includes(user._id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
            >
              {addedFriends.includes(user._id) ? 'Added' : 'Add'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChatScreen;