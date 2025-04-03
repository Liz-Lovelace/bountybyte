import React from 'react';
import { useSelector } from 'react-redux';
import Posts from '../Posts';
import NewPostForm from '../NewPostForm';

export default function HomePage() {
  const { isLoggedIn } = useSelector(state => state.auth);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Task Posts</h1>
      
      {isLoggedIn && <NewPostForm />}
      
      <div className="mb-8">
        <Posts />
      </div>
    </div>
  );
} 