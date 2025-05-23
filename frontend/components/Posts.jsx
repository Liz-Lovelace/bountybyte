import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsThunk } from '../store/postsSlice';
import Link from './core/Link';
import TechPill from './TechPill';

export default function Posts() {
  const dispatch = useDispatch();
  const postsById = useSelector(state => state.posts.postsById);
  const isLoading = useSelector(state => state.posts.isLoading);
  const error = useSelector(state => state.posts.error);

  useEffect(() => {
    dispatch(fetchPostsThunk());
  }, [dispatch]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading posts...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  const posts = Object.values(postsById).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Task Posts</h2>
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No task posts found.</p>
        ) : (
          posts.map(post => (
            <Link 
              key={post.id} 
              href={`/bounty/${post.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <div className="prose mb-2">
                <p className="text-gray-800">{post.task_description}</p>
              </div>
              {post.tech_stack && post.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 mb-3">
                  {post.tech_stack.map((tech) => (
                    <TechPill key={tech} iconName={tech} />
                  ))}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-3">
                {post.created_at && <span>Posted: {formatDate(post.created_at)}</span>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 