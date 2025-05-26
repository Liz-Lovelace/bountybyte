import React from 'react';
import { useSelector } from 'react-redux';
import Posts from '../Posts';
import Link from '../core/Link';

export default function HomePage() {
  const { isLoggedIn } = useSelector(state => state.auth);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Task Posts</h1>
        {isLoggedIn && (
          <Link
            href="/newPost"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Post
          </Link>
        )}
      </div>
      
      <div className="mb-8">
        <Posts />
      </div>
    </div>
  );
} 