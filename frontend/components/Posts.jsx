import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchPostsThunk,
  selectAllPosts,
  selectPostsLoading,
  selectPostsError
} from '../store/postsSlice';

export default function Posts() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const isLoading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

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

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Task Posts</h2>
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No task posts found.</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <div className="prose mb-2">
                <p className="text-gray-800">{post.task_description}</p>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                {post.created_at && <span>Posted: {formatDate(post.created_at)}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 