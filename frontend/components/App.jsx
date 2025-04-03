import React from 'react';
import { useSelector } from 'react-redux';
import NavBar from './NavBar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PostViewPage from './pages/PostViewPage';

export default function App() {
  const currentPath = useSelector(state => state.router.currentPath);

  return (
    <div>
      <NavBar />
      {currentPath === '/login' ? <AuthPage /> : 
       currentPath.startsWith('/bounty') ? <PostViewPage /> : 
       <HomePage />}
    </div>
  );
}