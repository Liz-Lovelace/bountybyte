import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../standardApi.js';

// Create API thunks
export const fetchPostsThunk = createApiThunk(
  'posts/fetchPosts',
  'getPosts',
  {}
);

export const createPostThunk = createApiThunk(
  'posts/createPost',
  'createPost',
  { title: '', taskDescription: '' }
);

const initialState = {
  posts: [],
  isLoading: false,
  isCreating: false,
  error: null,
  createError: null
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch posts cases
      .addCase(fetchPostsThunk.begin, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostsThunk.happyPath, (state, action) => {
        state.posts = action.payload;
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
        state.posts = [action.payload, ...state.posts];
        state.isCreating = false;
      })
      .addCase(createPostThunk.validation, (state, action) => {
        state.createError = `Validation error: ${JSON.stringify(action.payload)}`;
        state.isCreating = false;
      })
      .addCase(createPostThunk.catastrophicError, (state, action) => {
        state.createError = `Error creating post: ${action.payload}`;
        state.isCreating = false;
      })
      .addCase(createPostThunk.end, (state) => {
        state.isCreating = false;
      });
  }
});

// Selectors
export const selectAllPosts = (state) => state.posts.posts;
export const selectPostsLoading = (state) => state.posts.isLoading;
export const selectPostsError = (state) => state.posts.error;
export const selectPostCreating = (state) => state.posts.isCreating;
export const selectCreateError = (state) => state.posts.createError;

export default postsSlice.reducer; 