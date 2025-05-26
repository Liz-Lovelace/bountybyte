import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPostsThunk, 
  updatePostFormThunk,
  setPostFormThunk,
  setCompressingFilesThunk,
  resetPostFormThunk,
  submitPostFormThunk,
  cancelPostFormThunk,
  removeProjectFilesThunk
} from '../../store/postsSlice';
import { navigateTo } from '../../store/routerSlice';
import UploadFolder from '../UploadFolder';
import TechStackInputSection from '../form-primitives/TechStackInputSection';
import OneLineInputWithValidation from '../form-primitives/OneLineInputWithValidation';

export default function EditPostPage() {
  const dispatch = useDispatch();
  const currentPath = useSelector(state => state.router.currentPath);
  const postsById = useSelector(state => state.posts.postsById);
  const isCreating = useSelector(state => state.posts.isCreating);
  const error = useSelector(state => state.posts.createError);
  const { isLoggedIn, me } = useSelector(state => state.auth);
  const postForm = useSelector(state => state.posts.postForm);
  const validationFields = useSelector(state => state.posts.postFormValidation.fields);
  
  const isEditing = currentPath.startsWith('/editPost/');
  const postId = isEditing ? currentPath.split('/editPost/')[1] : null;
  const post = postId ? postsById[postId] : null;

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchPostsThunk());
    }
    return () => {
      dispatch(resetPostFormThunk());
    };
  }, [dispatch, isEditing]);

  useEffect(() => {
    if (isEditing && post) {
      dispatch(setPostFormThunk({
        title: post.title,
        taskDescription: post.task_description,
        techStack: post.tech_stack || [],
      }));
    }
  }, [isEditing, post, dispatch]);

  if (!isLoggedIn || !me || (isEditing && (!post || me.id !== post.author_id))) {
    dispatch(navigateTo(isEditing ? `/bounty/${postId}` : '/'));
    return null;
  }

  const handleChange = (field, value) => {
    dispatch(updatePostFormThunk(field, value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitPostFormThunk(isEditing, postId));
  };

  const handleCancel = () => {
    dispatch(cancelPostFormThunk(isEditing, postId));
  };

  const handleFileUpload = (files) => {
    dispatch(setCompressingFilesThunk(files.isCompressing));
    dispatch(updatePostFormThunk('projectFiles', files));
  };

  const handleRemoveFiles = () => {
    dispatch(removeProjectFilesThunk());
  };

  const isSubmitDisabled = isCreating || 
    postForm.isCompressingFiles || 
    !postForm.title.trim() || 
    !postForm.taskDescription.trim();

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {isEditing ? 'Edit Task Post' : 'Create New Task Post'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <OneLineInputWithValidation
            label="Title"
            name="title"
            value={postForm.title}
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={isCreating}
            placeholder="Enter post title"
            required
            errors={validationFields.title}
          />
          
          <div className="mb-4">
            <label htmlFor="taskDescription" className="block text-gray-700 font-medium mb-2">
              Task Description
            </label>
            <textarea
              id="taskDescription"
              value={postForm.taskDescription}
              onChange={(e) => handleChange('taskDescription', e.target.value)}
              disabled={isCreating}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe the task..."
              required
            />
            {validationFields.taskDescription?.map((error, i) => (
              <div key={i} className="text-red-500 text-sm mt-1">{error.text}</div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Tech Stack
            </label>
            <TechStackInputSection 
              techIds={postForm.techStack}
              updateTechIds={(techIds) => handleChange('techStack', techIds)}
            />
            {validationFields.techStack?.map((error, i) => (
              <div key={i} className="text-red-500 text-sm mt-1">{error.text}</div>
            ))}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Project Files
            </label>
            
            {isEditing && post.does_have_project_files && !postForm.removeExistingFiles && (
              <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-600">Current project files attached</span>
                  <button
                    type="button"
                    onClick={handleRemoveFiles}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Files
                  </button>
                </div>
              </div>
            )}

            <UploadFolder 
              onChange={handleFileUpload} 
              disabled={isCreating}
            />
            
            {postForm.projectFiles && postForm.projectFiles.fileCount > 0 && !postForm.isCompressingFiles && (
              <div className="mt-2 text-sm text-gray-600">
                {postForm.projectFiles.fileCount} new file(s) selected
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Saving...' : 
               postForm.isCompressingFiles ? 'Compressing Files...' : 
               isEditing ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 