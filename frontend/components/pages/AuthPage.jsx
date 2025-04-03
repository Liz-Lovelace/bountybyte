import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RegisterForm from '../RegisterForm';
import LoginForm from '../LoginForm';
import * as auth from '../../store/authSlice';

export default function AuthPage() {
  const dispatch = useDispatch();
  const { isAuthLoading, isLoggedIn, me } = useSelector(state => state.auth);

  if (isAuthLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center mb-4">Loading auth state...</div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4 p-4 bg-green-100 rounded flex justify-between items-center">
          <div>
            <p>Welcome, {me.username}!</p>
            <p className="text-sm text-gray-600">{me.email}</p>
          </div>
          <button
            onClick={() => dispatch(auth.logout())}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
} 