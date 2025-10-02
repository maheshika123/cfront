"use client";

import { useState } from 'react';
import { FiMoreVertical, FiSearch } from 'react-icons/fi';
import { FaCamera } from 'react-icons/fa';
import Link from 'next/link';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-[#075E54] text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">WhatsApp</h1>
      <div className="flex items-center space-x-4">
        <FaCamera size={20} />
        <FiSearch size={20} />
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}>
            <FiMoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <Link href="/settings">
                <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;