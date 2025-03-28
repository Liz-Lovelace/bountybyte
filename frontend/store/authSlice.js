import { createSlice } from '@reduxjs/toolkit';
import { createApiThunk } from '../standardApi.js';

const registerUserApiCall = createApiThunk(
  'auth/registerUser',
  'register',
  { username: '', email: '', password: '', repeatPassword: '' }
);

const loginUserApiCall = createApiThunk(
  'auth/loginUser',
  'login',
  { email: '', password: '' }
);

export const registerUser = (args) => async (dispatch) => {
  const result = await dispatch(registerUserApiCall(args));
  if (result?.responseType === 'happyPathResponse') {
    await dispatch(refreshAuth());
  }
};

export const loginUser = (args) => async (dispatch) => {
  const result = await dispatch(loginUserApiCall(args));
  if (result?.responseType === 'happyPathResponse') {
    await dispatch(refreshAuth());
  }
};

export const refreshAuth = createApiThunk(
  'auth/refreshAuth',
  'getMe'
);

export const logout = createApiThunk(
  'auth/logout',
  'clearAuthCookie'
);

const initialState = {
  isAuthLoading: true,
  isLoggedIn: false,
  me: {
    username: null,
    email: null,
    id: null
  },
  isRegistering: false,
  registerFormValidation: {
    fields: {
      username: [],
      email: [],
      password: [],
      repeatPassword: []
    }
  },
  registerForm: {
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  },
  isLoggingIn: false,
  loginFormValidation: {
    fields: {
      email: [],
      password: []
    }
  },
  loginForm: {
    email: '',
    password: ''
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateRegisterForm: (state, action) => {
      state.registerForm[action.payload.field] = action.payload.value;
    },
    updateLoginForm: (state, action) => {
      state.loginForm[action.payload.field] = action.payload.value;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserApiCall.begin, (state) => {
        state.isRegistering = true;
        state.registerFormValidation = initialState.registerFormValidation;
      })
      .addCase(registerUserApiCall.happyPath, (state, action) => {
        state.registerForm = initialState.registerForm;
      })
      .addCase(registerUserApiCall.validation, (state, action) => {
        state.registerFormValidation = action.payload;
      })
      .addCase(registerUserApiCall.end, (state) => {
        state.isRegistering = false;
      })

      // Login
      .addCase(loginUserApiCall.begin, (state) => {
        state.isLoggingIn = true;
        state.loginFormValidation = initialState.loginFormValidation;
      })
      .addCase(loginUserApiCall.happyPath, (state, action) => {
        state.loginForm = initialState.loginForm;
      })
      .addCase(loginUserApiCall.validation, (state, action) => {
        state.loginFormValidation = action.payload;
      })
      .addCase(loginUserApiCall.end, (state) => {
        state.isLoggingIn = false;
      })

      // Refresh auth
      .addCase(refreshAuth.begin, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(refreshAuth.happyPath, (state, action) => {
        if (action.payload) {
          state.me = action.payload;
          state.isLoggedIn = true;
        } else {
          state.me = initialState.me;
          state.isLoggedIn = false;
        }
      })
      .addCase(refreshAuth.end, (state) => {
        state.isAuthLoading = false;
      })

      // Logout
      .addCase(logout.begin, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(logout.happyPath, (state) => {
        state.isLoggedIn = false;
        state.me = initialState.me;
      })
      .addCase(logout.end, (state) => {
        state.isAuthLoading = false;
      });
  }
});

export const { updateRegisterForm, updateLoginForm } = authSlice.actions;
export default authSlice.reducer; 