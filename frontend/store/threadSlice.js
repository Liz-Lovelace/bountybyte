import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../standardApi.js';

export const fetchRepliesThunk = createApiThunk(
  'thread/fetchReplies',
  'getReplies',
  {}
);

export const createReplyThunk = createApiThunk(
  'thread/createReply',
  'createReply',
  { postId: '', parentReplyId: null, bodyText: '' }
);

const DEFAULT_REPLY_UI_STATE = {
  bodyCollapsed: true,
  showReplyForm: false
};

const DEFAULT_FORM_STATE = {
  bodyText: '',
  isPreviewingMarkdown: false,
  isSubmitting: false
};

function buildReplyTree(repliesById) {
  const replyTree = [];
  const replyChildrenMap = {};

  // First pass: initialize children arrays
  Object.values(repliesById).forEach(reply => {
    replyChildrenMap[reply.id] = [];
  });

  // Second pass: build parent-child relationships
  Object.values(repliesById).forEach(reply => {
    if (reply.parentReplyId === null) {
      replyTree.push(reply.id);
    } else {
      replyChildrenMap[reply.parentReplyId].push(reply.id);
    }
  });

  // Sort root level replies by date
  replyTree.sort((aId, bId) => {
    return new Date(repliesById[bId].createdAt) - new Date(repliesById[aId].createdAt);
  });

  return {
    rootIds: replyTree,
    childrenById: replyChildrenMap
  };
}

const initialState = {
  repliesById: {},
  repliesUIStateById: {},
  replyTree: {
    rootIds: [],
    childrenById: {}
  },
  isLoading: false,
  replyFormsById: {
    null: {
      ...DEFAULT_FORM_STATE
    }
  }
};

export const toggleBodyCollapse = (replyId) => (dispatch) => {
  dispatch(threadSlice.actions.toggleReplyBodyCollapse(replyId));
};

export const updateComposeReplyForm = (replyId, bodyText) => (dispatch) => {
  dispatch(threadSlice.actions.setComposeReplyBodyText({ replyId, bodyText }));
};

export const toggleMarkdownPreview = (replyId) => (dispatch) => {
  dispatch(threadSlice.actions.togglePreviewingMarkdown(replyId));
};

export const toggleReplyForm = (replyId) => (dispatch) => {
  dispatch(threadSlice.actions.toggleReplyFormVisibility(replyId));
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    toggleReplyBodyCollapse: (state, action) => {
      const replyId = action.payload;
      state.repliesUIStateById[replyId].bodyCollapsed = 
        !state.repliesUIStateById[replyId].bodyCollapsed;
    },
    setComposeReplyBodyText: (state, action) => {
      const { replyId, bodyText } = action.payload;
      state.replyFormsById[replyId].bodyText = bodyText;
    },
    togglePreviewingMarkdown: (state, action) => {
      const replyId = action.payload;
      state.replyFormsById[replyId].isPreviewingMarkdown = 
        !state.replyFormsById[replyId].isPreviewingMarkdown;
    },
    toggleReplyFormVisibility: (state, action) => {
      const replyId = action.payload;
      state.repliesUIStateById[replyId].showReplyForm = 
        !state.repliesUIStateById[replyId].showReplyForm;
      
      if (state.repliesUIStateById[replyId].showReplyForm) {
        state.replyFormsById[replyId] = { ...DEFAULT_FORM_STATE };
      } else {
        delete state.replyFormsById[replyId];
      }
    },
    clearComposeReplyForm: (state, action) => {
      const replyId = action.payload;
      delete state.replyFormsById[replyId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepliesThunk.begin, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRepliesThunk.happyPath, (state, action) => {
        state.repliesById = {};
        action.payload.forEach(reply => {
          state.repliesById[reply.id] = reply;
          state.repliesUIStateById[reply.id] = { ...DEFAULT_REPLY_UI_STATE };
        });
        state.replyTree = buildReplyTree(state.repliesById);
      })
      .addCase(fetchRepliesThunk.end, (state, action) => {
        state.isLoading = false;
      })

      .addCase(createReplyThunk.begin, (state, action) => {
        const { parentReplyId } = action.meta.args;
        if (parentReplyId && state.replyFormsById[parentReplyId]) {
          state.replyFormsById[parentReplyId].isSubmitting = true;
        }
      })
      .addCase(createReplyThunk.happyPath, (state, action) => {
        const newReply = action.payload;
        state.repliesById[newReply.id] = newReply;
        state.repliesUIStateById[newReply.id] = { ...DEFAULT_REPLY_UI_STATE };
        state.replyTree = buildReplyTree(state.repliesById);
        
        if (newReply.parentReplyId) {
          delete state.replyFormsById[newReply.parentReplyId];
          state.repliesUIStateById[newReply.parentReplyId].showReplyForm = false;
        } else {
          state.replyFormsById[null] = { ...DEFAULT_FORM_STATE };
        }
      })
      .addCase(createReplyThunk.end, (state, action) => {
        const { parentReplyId } = action.meta.args;
        if (parentReplyId && state.replyFormsById[parentReplyId]) {
          state.replyFormsById[parentReplyId].isSubmitting = false;
        }
      });
  }
});

export default threadSlice.reducer; 