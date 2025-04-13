import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateComposeReplyForm,
  toggleMarkdownPreview,
  createReplyThunk,
} from '../../store/threadSlice';

export default function ComposeReplyForm({ postId, parentReplyId }) {
  const dispatch = useDispatch();
  const formState = useSelector(state => state.thread.replyFormsById[parentReplyId]);
  const { bodyText, isPreviewingMarkdown, isSubmitting } = formState;
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [bodyText]);

  const handleSubmit = async () => {
    await dispatch(createReplyThunk({ 
      postId, 
      parentReplyId, 
      bodyText: bodyText.trim() 
    }));
  };

  return (
    <div className="mb-6">
      <div className="border rounded-lg">
        {/* Tab buttons */}
        <div className="flex border-b bg-gray-50">
          <button
            className={`px-4 py-2 ${!isPreviewingMarkdown ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => dispatch(toggleMarkdownPreview(parentReplyId))}
          >
            Write
          </button>
          <button
            className={`px-4 py-2 ${isPreviewingMarkdown ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => dispatch(toggleMarkdownPreview(parentReplyId))}
          >
            Preview
          </button>
        </div>

        {/* Content area */}
        <div className="p-4">
          {!isPreviewingMarkdown ? (
            <textarea
              ref={textareaRef}
              className="w-full min-h-[200px] p-2 border rounded resize-none overflow-hidden"
              placeholder="Add your comment here..."
              value={bodyText}
              onChange={(e) => dispatch(updateComposeReplyForm(parentReplyId, e.target.value))}
            />
          ) : (
            <div className="prose prose-sm max-w-none min-h-[200px] p-2">
              <div className="preserve-newlines">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {bodyText}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-600">📝 Markdown is supported</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting || !bodyText.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </div>
    </div>
  );
} 