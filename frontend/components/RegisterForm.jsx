import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as auth from '../store/authSlice';
import OneLineInputWithValidation from './form-primitives/OneLineInputWithValidation';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const isRegistering = useSelector(state => state.auth.isRegistering);
  const validationFields = useSelector(state => state.auth.registerFormValidation.fields);
  const formData = useSelector(state => state.auth.registerForm);

  const handleChange = (e) => {
    dispatch(auth.updateRegisterForm({
      field: e.target.name,
      value: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(auth.registerUser({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      repeatPassword: formData.repeatPassword
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <OneLineInputWithValidation
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          errors={validationFields.username}
        />

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

        <OneLineInputWithValidation
          label="Repeat Password"
          name="repeatPassword"
          type="password"
          value={formData.repeatPassword}
          onChange={handleChange}
          required
          errors={validationFields.repeatPassword}
        />

        <button
          type="submit"
          disabled={isRegistering}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isRegistering ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
} 