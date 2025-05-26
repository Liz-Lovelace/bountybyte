import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsThunk } from '../../store/postsSlice';
import ReplyThread from '../reply-thread/ReplyThread';
import ComposeReplyForm from '../reply-thread/ComposeReplyForm';
import { fetchRepliesThunk } from '../../store/threadSlice';
import { fetchUsersRelatedToPostThunk } from '../../store/usersSlice';
import Link from '../core/Link';
import TechPill from '../TechPill';

export default function PostViewPage() {
  const dispatch = useDispatch();
  const currentPath = useSelector(state => state.router.currentPath);
  const postsById = useSelector(state => state.posts.postsById);
  const usersById = useSelector(state => state.users.usersById);
  const isLoading = useSelector(state => state.posts.isLoading);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const me = useSelector(state => state.auth.me);

  const postId = currentPath.split('/bounty/')[1];
  const post = postsById[postId];

  useEffect(() => {
    dispatch(fetchPostsThunk());
    dispatch(fetchUsersRelatedToPostThunk({ postId }));
    dispatch(fetchRepliesThunk());
  }, [dispatch, postId]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading post...</div>;
  }

  if (!post) {
    return <div className="p-4 text-center text-red-500">Post not found</div>;
  }


  const author = usersById[post.author_id];

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {isLoggedIn && author && me && me.id === author.id && (
            <Link
              href={`/editPost/${post.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
              Edit Post
            </Link>
          )}
        </div>

        <div className="prose mb-4">
          <p className="text-gray-800">{post.task_description}</p>
        </div>
        
        {post.tech_stack && post.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tech_stack.map((tech) => (
              <TechPill key={tech} iconName={tech} />
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500 mb-4">
          {post.created_at && <span>Posted: {formatDate(post.created_at)}</span>}
        </div>
        
        {post.does_have_project_files && (
          <div className="mt-4">
            <a 
              href={`/projectfiles/${postId}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              download
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download Project Files
            </a>
          </div>
        )}

        <div className="mt-4">
          Posted by: {author ? (
            <Link href={`/user/${author.id}`} className="text-blue-500 underline hover:text-blue-700">{author.username}</Link>
          ) : (
            <span>Unknown</span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {isLoggedIn && <ComposeReplyForm postId={postId} parentReplyId={null} />}
        <ReplyThread postId={postId} />
      </div>
    </div>
  );
} 