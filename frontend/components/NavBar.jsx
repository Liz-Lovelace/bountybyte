import React from 'react';
import { useSelector } from 'react-redux';
import Link from './core/Link';

export default function NavBar() {
  const { isLoggedIn, me } = useSelector(state => state.auth);

  return (
    <nav className="bg-gray-800 p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link 
            href="/"
            className="text-white hover:text-gray-300"
          >
            Home
          </Link>
        </div>
        
        <div className="flex items-center">
          <Link 
            href="/login"
            className="text-white hover:text-gray-300"
          >
            {isLoggedIn ? me.username : 'Log in / Register'}
          </Link>
        </div>
      </div>
    </nav>
  );
} 