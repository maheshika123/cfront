"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Tabs from '../../components/Tabs';
import ChatList from '../../components/ChatList';
import FloatingActionButton from '../../components/FloatingActionButton';

const HomeScreen = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Tabs />
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default HomeScreen;