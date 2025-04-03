import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useDispatch } from 'react-redux';
import { toggleBodyCollapse } from '../../store/threadSlice';

const COLLAPSED_HEIGHT = 100; // 20 * 4px (Tailwind's h-20)

export default function Reply({ reply, childReplies }) {
  const dispatch = useDispatch();
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
            ${reply.uiState.bodyCollapsed && showCollapseButton ? 'max-h-30 [mask-image:linear-gradient(to_top,transparent,black_70%)]' : 'h-auto'}
          `}
        >
          <ReactMarkdown 
            rehypePlugins={[rehypeHighlight]}
          >
            {reply.bodyText}
          </ReactMarkdown>
        </div>
        <div className="flex gap-4 p-2">
          {showCollapseButton && (
            <button
              onClick={handleToggleCollapse}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              {reply.uiState.bodyCollapsed ? 'Show More' : 'Show Less'}
            </button>
          )}
          <span className="text-xs text-gray-500 mt-1">
            {reply.id}
          </span>
        </div>
      </div>
      
      {childReplies?.length > 0 && (
        <div className="pl-6 border-l-2 border-gray-300">
          {childReplies}
        </div>
      )}
    </div>
  );
} 