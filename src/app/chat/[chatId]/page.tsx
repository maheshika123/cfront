"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSocket } from '../../../contexts/SocketContext';
import { useWebRTC } from '../../../contexts/WebRTCContext';
import axios from 'axios';
import { FiSend, FiSmile, FiPhone } from 'react-icons/fi';
import Picker, { EmojiClickData } from 'emoji-picker-react';
import Call from '../../../components/Call';

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  content: string;
  chat: string;
  replyTo?: Message; // Optional, as not all messages are replies
}

interface User {
  _id: string;
}

const ChatScreen = () => {
  const params = useParams();
  const { chatId } = params;
  const { socket } = useSocket();
  const { isCalling, callAccepted, callUser, caller } = useWebRTC();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleCall = () => {
    const friendId = (chatId as string).split('-').find(id => id !== currentUser?._id);
    if (friendId) {
      callUser(friendId);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/me', {
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
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/messages/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      if (message.chat === chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, chatId]);

  useEffect(() => {
    if (socket && chatId) {
      socket.emit('joinRoom', chatId);
    }
  }, [socket, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prevInput => prevInput + emojiData.emoji);
  };

  const handleSendMessage = () => {
    if (socket && newMessage.trim() !== '' && currentUser) {
      const messageData = {
        sender: currentUser._id,
        chat: chatId, // Changed from recipient to chat
        content: newMessage,
        replyTo: replyToMessage ? replyToMessage._id : null, // Added replyTo
      };
      socket.emit('sendMessage', messageData);
      setNewMessage('');
      setReplyToMessage(null); // Clear replyToMessage after sending
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {(isCalling || callAccepted || caller) && <Call />}
      <header className="bg-[#075E54] text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chat</h1>
        <button onClick={handleCall} className="p-2 rounded-full hover:bg-white/20">
          <FiPhone size={20} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex mb-2 ${msg.sender._id === currentUser?._id ? 'justify-end' : 'justify-start'}`}
            onClick={() => setReplyToMessage(msg)} // Added onClick
          >
            <div className={`p-2 rounded-lg max-w-xs ${msg.sender._id === currentUser?._id ? 'bg-green-200' : 'bg-white'}`}>
              {msg.replyTo && ( // Display replied-to message
                <div className="border-l-4 border-blue-500 pl-2 mb-1 text-sm text-gray-600">
                  Replying to {msg.replyTo.sender.username}: "{msg.replyTo.content}"
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white flex flex-col"> {/* Changed to flex-col */}
        {replyToMessage && ( // Display reply preview
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-t-lg mb-2">
            <div className="text-sm text-gray-600">
              Replying to {replyToMessage.sender.username}: "{replyToMessage.content}"
            </div>
            <button onClick={() => setReplyToMessage(null)} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
        )}
        <div className="flex items-center"> {/* Original input div */}
          <div className="relative w-full">
            {showEmojiPicker && (
              <div className="absolute bottom-12">
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="absolute left-2 top-2.5">
              <FiSmile size={20} />
            </button>
            <input
              type="text"
              className="w-full p-2 pl-10 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </div>
          <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;