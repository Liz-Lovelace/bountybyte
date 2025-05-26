import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../standardApi.js';
import { navigateTo } from './routerSlice';

export const fetchPostsThunk = createApiThunk(
  'posts/fetchPosts',
  'getPosts',
  {}
);

export const createPostThunk = createApiThunk(
  'posts/createPost',
  'createPost',
  { title: '', taskDescription: '', projectFiles: '', techStack: [] }
);

export const updatePostThunk = createApiThunk(
  'posts/updatePost',
  'updatePost',
  { postId: '', title: '', taskDescription: '', projectFiles: null, techStack: [], removeExistingFiles: false }
);

// Form management thunks
export const updatePostFormThunk = (field, value) => (dispatch) => {
  dispatch(postsSlice.actions.updatePostForm({ field, value }));
};

export const setPostFormThunk = (formData) => (dispatch) => {
  dispatch(postsSlice.actions.setPostForm(formData));
};

export const setCompressingFilesThunk = (isCompressing) => (dispatch) => {
  dispatch(postsSlice.actions.setCompressingFiles(isCompressing));
};

export const resetPostFormThunk = () => (dispatch) => {
  dispatch(postsSlice.actions.resetPostForm());
};

export const removeProjectFilesThunk = () => (dispatch) => {
  dispatch(postsSlice.actions.setRemoveExistingFiles(true));
  dispatch(postsSlice.actions.updatePostForm({ field: 'projectFiles', value: null }));
};

// Form submission thunks
export const submitPostFormThunk = (isEditing, postId) => async (dispatch, getState) => {
  const { postForm } = getState().posts;
  
  if (!postForm.title.trim() || !postForm.taskDescription.trim() || postForm.isCompressingFiles) {
    return;
  }

  const postData = {
    title: postForm.title.trim(),
    taskDescription: postForm.taskDescription.trim(),
    projectFiles: postForm.projectFiles ? postForm.projectFiles.zipBase64 : null,
    techStack: postForm.techStack,
    removeExistingFiles: postForm.removeExistingFiles
  };

  if (isEditing) {
    const result = await dispatch(updatePostThunk({ ...postData, postId }));
    if (result?.responseType === 'happyPathResponse') {
      dispatch(navigateTo(`/bounty/${postId}`));
    }
  } else {
    const result = await dispatch(createPostThunk(postData));
    let newPostId = result.data.id;
    if (result?.responseType === 'happyPathResponse') {
      dispatch(navigateTo(`/bounty/${newPostId}`));
    }
  }
};

export const cancelPostFormThunk = (isEditing, postId) => (dispatch) => {
  dispatch(postsSlice.actions.resetPostForm());
  dispatch(navigateTo(isEditing ? `/bounty/${postId}` : '/'));
};

const initialState = {
  postsById: {},
  isLoading: false,
  isCreating: false,
  error: null,
  createError: null,
  postForm: {
    title: '',
    taskDescription: '',
    projectFiles: null,
    techStack: [],
    isCompressingFiles: false,
    removeExistingFiles: false
  },
  postFormValidation: {
    fields: {
      title: [],
      taskDescription: [],
      techStack: []
    }
  }
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updatePostForm: (state, action) => {
      state.postForm[action.payload.field] = action.payload.value;
    },
    setPostForm: (state, action) => {
      state.postForm = { ...state.postForm, ...action.payload };
    },
    setCompressingFiles: (state, action) => {
      state.postForm.isCompressingFiles = action.payload;
    },
    resetPostForm: (state) => {
      state.postForm = initialState.postForm;
      state.postFormValidation = initialState.postFormValidation;
    },
    setRemoveExistingFiles: (state, action) => {
      state.postForm.removeExistingFiles = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts cases
      .addCase(fetchPostsThunk.begin, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostsThunk.happyPath, (state, action) => {
        state.postsById = {};
        action.payload.forEach(post => {
          state.postsById[post.id] = post;
        });
        state.isLoading = false;
      })
      .addCase(fetchPostsThunk.validation, (state, action) => {
        state.error = `Validation error: ${JSON.stringify(action.payload)}`;
        state.isLoading = false;
      })
      .addCase(fetchPostsThunk.catastrophicError, (state, action) => {
        state.error = `Error fetching posts: ${action.payload}`;
        state.isLoading = false;
      })
      .addCase(fetchPostsThunk.end, (state) => {
        state.isLoading = false;
      })
      
      // Create post cases
      .addCase(createPostThunk.begin, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createPostThunk.happyPath, (state, action) => {
        const newPost = action.payload;
        state.postsById[newPost.id] = newPost;
        state.isCreating = false;
        state.postForm = initialState.postForm;
        state.postFormValidation = initialState.postFormValidation;
      })
      .addCase(createPostThunk.validation, (state, action) => {
        state.postFormValidation.fields = action.payload.fields;
        state.isCreating = false;
      })
      .addCase(createPostThunk.catastrophicError, (state, action) => {
        state.createError = `Error creating post: ${action.payload}`;
        state.isCreating = false;
      })
      .addCase(createPostThunk.end, (state) => {
        state.isCreating = false;
      })
      
      // Update post cases
      .addCase(updatePostThunk.begin, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(updatePostThunk.happyPath, (state, action) => {
        const updatedPost = action.payload;
        state.postsById[updatedPost.id] = updatedPost;
        state.isCreating = false;
        state.postForm = initialState.postForm;
        state.postFormValidation = initialState.postFormValidation;
      })
      .addCase(updatePostThunk.validation, (state, action) => {
        state.postFormValidation.fields = action.payload.fields;
        state.isCreating = false;
      })
      .addCase(updatePostThunk.catastrophicError, (state, action) => {
        state.createError = `Error updating post: ${action.payload}`;
        state.isCreating = false;
      })
      .addCase(updatePostThunk.end, (state) => {
        state.isCreating = false;
      });
  }
});

export default postsSlice.reducer; 