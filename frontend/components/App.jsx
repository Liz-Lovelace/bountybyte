import React from 'react';
import { useSelector } from 'react-redux';
import NavBar from './NavBar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PostViewPage from './pages/PostViewPage';
import ProfileViewPage from './pages/ProfileViewPage';
import EditMyProfile from './pages/EditMyProfile';
import TestDevIconsPage from './pages/TestDevIconsPage';
export default function App() {
  const currentPath = useSelector(state => state.router.currentPath);

  return (
    <div>
      <NavBar />
      {currentPath === '/login' ? <AuthPage /> : 
       currentPath === '/editMyProfile' ? <EditMyProfile /> :
       currentPath === '/testDevIcons' ? <TestDevIconsPage /> :
       currentPath.startsWith('/user') ? <ProfileViewPage /> :
       currentPath.startsWith('/bounty') ? <PostViewPage /> : 
       <HomePage />}
    </div>
  );
}