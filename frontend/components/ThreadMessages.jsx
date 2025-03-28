import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchThreadMessages, 
  createThreadMessage, 
  deleteThreadMessage,
} from '../store/threadMessagesSlice';

export default function ThreadMessages() {
  const [newMessage, setNewMessage] = useState('');
  const dispatch = useDispatch();
  const { 
    messages, 
    status, 
    error, 
    creatingMessage, 
    deletingMessages 
  } = useSelector(state => state.threadMessages);

  useEffect(() => {
    dispatch(fetchThreadMessages());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && !creatingMessage) {
      dispatch(createThreadMessage({ bodyText: newMessage.trim() }));
      setNewMessage('');
    }
  };

  const handleDelete = (id) => {
    if (!deletingMessages[id]) {
      dispatch(deleteThreadMessage({ id }));
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (status === 'loading') {
    return <div className="p-4 text-center text-gray-600">Loading messages...</div>;
  }

  if (status === 'failed') {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Thread Messages</h2>
      
      <form onSubmit={handleSubmit} className={`mb-6 ${creatingMessage ? 'opacity-50' : ''}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={creatingMessage}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={creatingMessage || !newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingMessage ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No messages yet. Start the conversation!</p>
        ) : (
          messages.map(message => (
            <div key={message.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 mr-4">
                <p className="text-gray-800">{message.bodyText}</p>
                <small className="text-xs text-gray-500">{formatDate(message.createdAt)}</small>
              </div>
              <button 
                onClick={() => handleDelete(message.id)}
                className="px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deletingMessages[message.id]}
              >
                {deletingMessages[message.id] ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 