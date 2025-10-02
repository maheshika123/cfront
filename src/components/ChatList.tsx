
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatListItem from './ChatListItem';
import { useSocket } from '../contexts/SocketContext';

interface Friend {
  _id: string;
  name: string;
  username: string;
  lastMessage?: string;
  time?: string;
}

interface User {
  _id: string;
}

const ChatList = () => {
  const { socket } = useSocket();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://chatapp-production-22cf.up.railway.app/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch current user', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://chatapp-production-22cf.up.railway.app/api/users/friends', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (err) {
        setError('Failed to fetch friends');
      }
      setLoading(false);
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: any) => {
      const chatId = [message.sender._id, currentUser?._id].sort().join('-');
      if (message.chat !== chatId) return;

      setFriends((prevFriends) =>
        prevFriends.map((friend) => {
          if (friend._id === message.sender._id) {
            return {
              ...friend,
              lastMessage: message.content,
              time: new Date(message.timestamp).toLocaleTimeString(),
            };
          }
          return friend;
        })
      );
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, currentUser]);

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {friends.map((friend) => (
        <ChatListItem
          key={friend._id}
          friendId={friend._id}
          currentUserId={currentUser?._id || ''}
          name={friend.name}
          lastMessage={friend.lastMessage || `@${friend.username}`}
          time={friend.time || ''}
          avatar={`https://i.pravatar.cc/150?u=${friend.username}`}
        />
      ))}
    </div>
  );
};

export default ChatList;
