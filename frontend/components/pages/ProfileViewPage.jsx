import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserThunk } from '../../store/usersSlice';
import Link from '../core/Link';
import TechPill from '../TechPill';

function timeAgo(dateString) {
  const now = new Date();
  const then = new Date(dateString);
  const seconds = Math.floor((now - then) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `joined ${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'joined just now';
}

export default function ProfileViewPage() {
  const dispatch = useDispatch();
  const currentPath = useSelector(state => state.router.currentPath);
  const usersById = useSelector(state => state.users.usersById);
  const isLoading = useSelector(state => state.users.isLoading);
  const { isLoggedIn, me } = useSelector(state => state.auth);

  // Extract userId from path: /user/:uuid
  const userId = currentPath.split('/user/')[1];
  const user = usersById[userId];

  useEffect(() => {
    if (userId && !user) {
      dispatch(fetchUserThunk({ userId }));
    }
  }, [dispatch, userId, user]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading user...</div>;
  }

  if (!user) {
    return <div className="p-4 text-center text-red-500">User not found</div>;
  }

  const isOwnProfile = isLoggedIn && me && me.id === userId;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        {isOwnProfile && (
          <div className="mb-4 flex justify-end">
            <Link
              href="/editMyProfile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </Link>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-8">{user.username}</h1>
        {user.bio && (
          <div className="mb-8">
            <div className="font-semibold mb-2">Bio:</div>
            <div>{user.bio.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}</div>
          </div>
        )}
        {user.tech_stack && (
          <div className="mb-8">
            <div className="font-semibold mb-2">Tech Stack:</div>
            <div className="flex flex-wrap gap-2">
              {user.tech_stack.map((tech) => (
                <TechPill key={tech} iconName={tech} />
              ))}
            </div>
          </div>
        )}
        <div className="mb-2 text-gray-500">{timeAgo(user.created_at)}</div>
      </div>
    </div>
  );
} 