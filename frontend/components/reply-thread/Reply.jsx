import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBodyCollapse, toggleReplyForm } from '../../store/threadSlice';
import ComposeReplyForm from './ComposeReplyForm';

const COLLAPSED_HEIGHT = 100; // 20 * 4 

export default function Reply({ replyId }) {
  const dispatch = useDispatch();
  const reply = useSelector(state => state.thread.repliesById[replyId]);
  const uiState = useSelector(state => state.thread.repliesUIStateById[replyId]);
  const childIds = useSelector(state => state.thread.replyTree.childrenById[replyId]);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const contentRef = useRef(null);
  const [showCollapseButton, setShowCollapseButton] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowCollapseButton(contentHeight > COLLAPSED_HEIGHT);
    }
  }, [reply.bodyText]); // Re-check if content changes

  const handleToggleCollapse = () => {
    dispatch(toggleBodyCollapse(reply.id));
  };

  const handleToggleReplyForm = () => {
    dispatch(toggleReplyForm(replyId));
  };

  return (
    <div className="mb-4">
      <div className="my-2 bg-gray-100 rounded-lg">
        <div className="flex gap-4 p-2">
          <div className="text-sm text-gray-600 mb-1">
            User: {reply.userId}
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {new Date(reply.createdAt).toLocaleString()}
          </span>
        </div>
        <div 
          ref={contentRef}
          className={`
            px-4 text-gray-900 prose prose-sm max-w-none
            overflow-hidden transition-height duration-200 ease-in-out
            ${uiState.bodyCollapsed && showCollapseButton ? 'max-h-30 [mask-image:linear-gradient(to_top,transparent,black_70%)]' : 'h-auto'}
          `}
        >
          <div className="preserve-newlines">
            <ReactMarkdown 
              rehypePlugins={[rehypeHighlight]}
          >
              {reply.bodyText}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex gap-4 p-2">
          {showCollapseButton && (
            <button
              onClick={handleToggleCollapse}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              {uiState.bodyCollapsed ? 'Show More' : 'Show Less'}
            </button>
          )}
          {isLoggedIn && (
            <button
              onClick={handleToggleReplyForm}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Reply
            </button>
          )}
        </div>
      </div>
      
      {uiState.showReplyForm && (
        <div className="pl-6">
          <ComposeReplyForm postId={reply.postId} parentReplyId={reply.id} />
        </div>
      )}
      
      {childIds?.length > 0 && (
        <div className="pl-6 border-l-2 border-gray-300">
          {childIds.map(childId => (
            <Reply key={childId} replyId={childId} />
          ))}
        </div>
      )}
    </div>
  );
} 