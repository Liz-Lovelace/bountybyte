import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as auth from '../store/authSlice';
import OneLineInputWithValidation from './form-primitives/OneLineInputWithValidation';

export default function LoginForm() {
  const dispatch = useDispatch();
  const isLoggingIn = useSelector(state => state.auth.isLoggingIn);
  const validationFields = useSelector(state => state.auth.loginFormValidation.fields);
  const formData = useSelector(state => state.auth.loginForm);

  const handleChange = (e) => {
    dispatch(auth.updateLoginForm({
      field: e.target.name,
      value: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(auth.loginUser({
      email: formData.email,
      password: formData.password
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <OneLineInputWithValidation
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          errors={validationFields.email}
        />

        <OneLineInputWithValidation
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          errors={validationFields.password}
        />

        <button
          type="submit"
          disabled={isLoggingIn}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 