import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPostThunk } from '../store/postsSlice';

export default function NewPostForm() {
  const [title, setTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const dispatch = useDispatch();
  const isCreating = useSelector(state => state.posts.isCreating);
  const error = useSelector(state => state.posts.createError);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim() && taskDescription.trim() && !isCreating) {
      dispatch(createPostThunk({ 
        title: title.trim(), 
        taskDescription: taskDescription.trim() 
      }));
      
      // Clear the form after submission
      setTitle('');
      setTaskDescription('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Task Post</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={isCreating ? 'opacity-70' : ''}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isCreating}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="taskDescription" className="block text-gray-700 font-medium mb-2">
            Task Description
          </label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            disabled={isCreating}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Describe the task..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isCreating || !title.trim() || !taskDescription.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
} 