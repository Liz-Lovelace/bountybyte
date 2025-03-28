import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import authReducer, { refreshAuth } from './authSlice';
import routerReducer, { initializeHistoryListener } from './routerSlice';

// Custom logger middleware
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  // console.log('Next State:', store.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    router: routerReducer,
  },
  /*
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggerMiddleware),
  */
});

store.dispatch(initializeHistoryListener());
store.dispatch(refreshAuth()); 