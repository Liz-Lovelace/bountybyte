import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../standardApi.js';

export const fetchUserThunk = createApiThunk(
  'users/fetchUser',
  'getUser',
  { userId: '' }
);

export const updateProfileThunk = createApiThunk(
  'users/updateProfile',
  'updateUserProfile',
  { bio: '', techStack: [] }
);

export const fetchUsersRelatedToPostThunk = createApiThunk(
  'users/fetchUsersRelatedToPost',
  'getUsersRelatedToPost',
  { postId: '' }
);

const initialState = {
  usersById: {},
  isLoading: false,
  isUpdating: false,
  editForm: {
    bio: '',
    techStack: []
  },
  editFormValidation: {
    fields: {
      bio: [],
      techStack: []
    }
  }
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateEditForm: (state, action) => {
      state.editForm[action.payload.field] = action.payload.value;
    },
    setEditForm: (state, action) => {
      state.editForm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.begin, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserThunk.happyPath, (state, action) => {
        const user = action.payload;
        state.usersById[user.id] = user;
      })
      .addCase(fetchUserThunk.end, (state) => {
        state.isLoading = false;
      })
      .addCase(updateProfileThunk.begin, (state) => {
        state.isUpdating = true;
        state.editFormValidation = initialState.editFormValidation;
      })
      .addCase(updateProfileThunk.happyPath, (state, action) => {
        const updated = action.payload;
        if (updated && updated.id) {
          state.usersById[updated.id] = {
            ...state.usersById[updated.id],
            ...updated
          };
        }
      })
      .addCase(updateProfileThunk.validation, (state, action) => {
        state.editFormValidation = action.payload;
      })
      .addCase(updateProfileThunk.end, (state) => {
        state.isUpdating = false;
      })
      .addCase(fetchUsersRelatedToPostThunk.happyPath, (state, action) => {
        for (const user of action.payload) {
          state.usersById[user.id] = user;
        }
      });
  }
});

export const { updateEditForm, setEditForm } = usersSlice.actions;
export default usersSlice.reducer; 