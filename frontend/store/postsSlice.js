import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../standardApi.js';

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

const initialState = {
  postsById: {},
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

export default postsSlice.reducer; 