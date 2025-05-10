import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: window.location.pathname,
};

const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    navigateToPath: (state, action) => {
      state.currentPath = action.payload;
    }
  }
});

export const navigateTo = (path) => (dispatch) => {
  window.history.pushState(null, '', path);
  dispatch(routerSlice.actions.navigateToPath(path));
};

export const initializeHistoryListener = () => (dispatch) => {
  window.addEventListener('popstate', () => {
    dispatch(routerSlice.actions.navigateToPath(window.location.pathname));
  });
};

export default routerSlice.reducer; 