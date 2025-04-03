import { createSlice, createSelector } from '@reduxjs/toolkit';
import { mockThreadData } from './mockThreadData';

const initialState = {
  repliesById: mockThreadData,
  repliesUIStateById: Object.fromEntries(
    Object.keys(mockThreadData).map(id => [id, { bodyCollapsed: true }])
  ),
  isLoading: false,
  error: null,
  composeReplyForm: {
    bodyText: '',
    isPreviewingMarkdown: false,
    isSubmitting: false,
    validation: {
      fields: {
        bodyText: []
      }
    }
  }
};

// Move buildReplyTree outside since it's a pure function
function buildReplyTree(repliesById, repliesUIStateById) {
  const repliesWithChildren = Object.fromEntries(
    Object.entries(repliesById).map(([id, reply]) => [
      id,
      { 
        ...reply, 
        uiState: repliesUIStateById[id] || { bodyCollapsed: true },
        children: [] 
      }
    ])
  );
  
  const rootReplies = [];
  
  Object.values(repliesWithChildren).forEach(reply => {
    if (reply.parentReplyId === null) {
      rootReplies.push(reply);
    } else {
      repliesWithChildren[reply.parentReplyId].children.push(reply);
    }
  });

  return rootReplies;
}

// Create a memoized selector for the reply tree
export const selectRepliesById = state => state.thread.repliesById;
export const selectRepliesUIStateById = state => state.thread.repliesUIStateById;

export const selectReplyTree = createSelector(
  [selectRepliesById, selectRepliesUIStateById],
  (repliesById, repliesUIStateById) => buildReplyTree(repliesById, repliesUIStateById)
);

export const toggleBodyCollapse = (replyId) => (dispatch) => {
  dispatch(threadSlice.actions.toggleReplyBodyCollapse(replyId));
};

// Add new selectors
export const selectComposeReplyForm = state => state.thread.composeReplyForm;

// Add new actions
export const updateComposeReplyForm = (bodyText) => (dispatch) => {
  dispatch(threadSlice.actions.setComposeReplyBodyText(bodyText));
};

export const toggleMarkdownPreview = () => (dispatch) => {
  dispatch(threadSlice.actions.togglePreviewingMarkdown());
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    toggleReplyBodyCollapse: (state, action) => {
      const replyId = action.payload;
      if (state.repliesUIStateById[replyId]) {
        state.repliesUIStateById[replyId].bodyCollapsed = 
          !state.repliesUIStateById[replyId].bodyCollapsed;
      } else {
        state.repliesUIStateById[replyId] = { bodyCollapsed: false };
      }
    },
    setComposeReplyBodyText: (state, action) => {
      state.composeReplyForm.bodyText = action.payload;
    },
    togglePreviewingMarkdown: (state) => {
      state.composeReplyForm.isPreviewingMarkdown = !state.composeReplyForm.isPreviewingMarkdown;
    },
    clearComposeReplyForm: (state) => {
      state.composeReplyForm = initialState.composeReplyForm;
    }
  }
});

export default threadSlice.reducer; 