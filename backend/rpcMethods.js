import moment from 'moment';
import { callerIdFromCookies, cookieResponse, happyPathResponse, validationResponse, ErrorText, assert } from './lib/rpcUtils.js';
import * as posts from './modules/posts.js';
import * as authentication from './modules/authentication.js';
import dotenv from 'dotenv';

dotenv.config();

export async function getPosts() {
  const allPosts = await posts.getAllPosts();
  return happyPathResponse(allPosts);
}

export async function createPost({ title, taskDescription }) {
  assert(title && title.trim(), 'Title is required');
  assert(taskDescription && taskDescription.trim(), 'Task description is required');
  
  const newPost = await posts.createPost(
    title.trim(),
    taskDescription.trim()
  );
  
  return happyPathResponse(newPost);
}

export async function getMe({ cookies }) {
  const callerId = callerIdFromCookies(cookies);
  if (!callerId) {
    return happyPathResponse(null);
  }
  const user = await authentication.getUserById(callerId);
  return happyPathResponse(user);
}

export async function register({ username, email, password, repeatPassword }) {
  const validationResult = await authentication.validateNewUser({
    username,
    email,
    password,
    repeatPassword
  });

  if (!validationResult.success) {
    return validationResponse(validationResult.errors);
  }

  const userId = await authentication.createUser({
    username,
    email,
    password
  });

  let jwt = await authentication.getAuthJWT({ userId, password });
  return cookieResponse({
    name: 'bountybyte-auth',
    value: jwt,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV != 'development',
      sameSite: 'strict',
    }
  });
}

export async function clearAuthCookie() {
  return cookieResponse({
    name: 'bountybyte-auth',
    value: '',
    options: { expires: new Date(0) }
  });
}

export async function login({ email, password }) {
  const validationResult = await authentication.validateLogin({
    email,
    password
  });

  if (!validationResult.success) {
    return validationResponse(validationResult.errors);
  }

  const user = await authentication.getUserByEmail(email);
  
  let jwt = await authentication.getAuthJWT({ userId: user.id, password });
  
  return cookieResponse({
    name: 'bountybyte-auth',
    value: jwt,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV != 'development',
      sameSite: 'strict'
    }
  });
}