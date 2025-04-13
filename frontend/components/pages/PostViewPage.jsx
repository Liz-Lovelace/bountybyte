import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsThunk } from '../../store/postsSlice';
import ReplyThread from '../reply-thread/ReplyThread';
import ComposeReplyForm from '../reply-thread/ComposeReplyForm';
import { fetchRepliesThunk } from '../../store/threadSlice';

export default function PostViewPage() {
  const dispatch = useDispatch();
  const currentPath = useSelector(state => state.router.currentPath);
  const postsById = useSelector(state => state.posts.postsById);
  const isLoading = useSelector(state => state.posts.isLoading);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const postId = currentPath.split('/bounty/')[1];
  const post = postsById[postId];

  useEffect(() => {
    dispatch(fetchPostsThunk());
    dispatch(fetchRepliesThunk());
  }, [dispatch]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading post...</div>;
  }

  if (!post) {
    return <div className="p-4 text-center text-red-500">Post not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="prose mb-4">
          <p className="text-gray-800">{post.task_description}</p>
        </div>
        <div className="text-sm text-gray-500">
          {post.created_at && <span>Posted: {formatDate(post.created_at)}</span>}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {isLoggedIn && <ComposeReplyForm postId={postId} parentReplyId={null} />}
        <ReplyThread postId={postId} />
      </div>
    </div>
  );
} 