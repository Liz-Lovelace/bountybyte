import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectComposeReplyForm, 
  updateComposeReplyForm,
  toggleMarkdownPreview
} from '../../store/threadSlice';

export default function ComposeReplyForm() {
  const dispatch = useDispatch();
  const { bodyText, isPreviewingMarkdown } = useSelector(selectComposeReplyForm);
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

  return (
    <div className="mb-6">
      <div className="border rounded-lg">
        {/* Tab buttons */}
        <div className="flex border-b bg-gray-50">
          <button
            className={`px-4 py-2 ${!isPreviewingMarkdown ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => dispatch(toggleMarkdownPreview())}
          >
            Write
          </button>
          <button
            className={`px-4 py-2 ${isPreviewingMarkdown ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => dispatch(toggleMarkdownPreview())}
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
              onChange={(e) => dispatch(updateComposeReplyForm(e.target.value))}
            />
          ) : (
            <div className="prose prose-sm max-w-none min-h-[200px] p-2">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {bodyText}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t bg-gray-50 text-sm text-gray-600">
          <span>📝 Markdown is supported</span>
        </div>
      </div>
    </div>
  );
} 