import React from 'react';
import { useSelector } from 'react-redux';
import NavBar from './NavBar';
import HomePage from './HomePage';
import AuthPage from './AuthPage';

export default function App() {
  const currentPath = useSelector(state => state.router.currentPath);

  return (
    <div>
      <NavBar />
      {currentPath === '/login' ? <AuthPage /> : <HomePage />}
    </div>
  );
}