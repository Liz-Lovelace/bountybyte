import moment from 'moment';
import { callerIdFromCookies, cookieResponse, happyPathResponse, validationResponse, ErrorText, assert } from './lib/rpcUtils.js';
import * as posts from './modules/posts.js';
import * as authentication from './modules/authentication.js';
import dotenv from 'dotenv';
import * as replies from './modules/replies.js';

dotenv.config();

export async function getPosts() {
  const allPosts = await posts.getAllPosts();
  return happyPathResponse(allPosts);
}

export async function createPost({ title, taskDescription, projectFiles, techStack, cookies }) {
  const callerId = callerIdFromCookies(cookies);
  assert(callerId, 'Authentication required');

  const validation = await posts.validatePost({ title, taskDescription, techStack });
  if (!validation.success) {
    return validationResponse(validation.errors);
  }
  
  // Convert base64 to Buffer if projectFiles exists
  let projectFilesBuffer = null;
  if (projectFiles) {
    projectFilesBuffer = Buffer.from(projectFiles, 'base64');
  }
  
  const newPost = await posts.createPost(
    title.trim(),
    taskDescription.trim(),
    projectFilesBuffer,
    callerId,
    techStack
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

export async function getReplies() {
  const allReplies = await replies.getAllReplies();
  let responseReplies = allReplies.map(reply => ({
    id: reply.id,
    bodyText: reply.body_text,
    createdAt: reply.created_at,
    userId: reply.user_id,
    postId: reply.post_id,
    parentReplyId: reply.parent_reply_id
  }));
  return happyPathResponse(responseReplies);
}

export async function createReply({ postId, parentReplyId, bodyText, cookies }) {
  const callerId = callerIdFromCookies(cookies);
  if (!callerId) {
    throw new Error('Authentication required');
  }

  assert(postId, 'Post ID is required');
  assert(bodyText && bodyText.trim(), 'Reply text is required');
  
  const newReply = await replies.createReply({
    postId,
    parentReplyId: parentReplyId || null,
    userId: callerId,
    bodyText: bodyText.trim()
  });

  let responseReply = {
    id: newReply.id,
    bodyText: newReply.body_text,
    createdAt: newReply.created_at,
    userId: newReply.user_id,
    postId: newReply.post_id,
    parentReplyId: newReply.parent_reply_id,
    authorId: newReply.author_id
  }
  
  return happyPathResponse(responseReply);
}

export async function getUser({ userId }) {
  const user = await authentication.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  // Only return id, username, created_at, bio, tech_stack
  return happyPathResponse({
    id: user.id,
    username: user.username,
    created_at: user.created_at,
    bio: user.bio,
    tech_stack: user.tech_stack
  });
}

export async function updateUserProfile({ bio, techStack, cookies }) {
  const callerId = callerIdFromCookies(cookies);
  assert(callerId, 'Not authenticated');

  // Validate using the module
  const validation = await authentication.validateProfileUpdate({ bio, techStack });
  if (!validation.success) {
    return validationResponse(validation.errors);
  }

  // Use the authentication module for updating
  const user = await authentication.updateUserProfile({
    userId: callerId,
    bio,
    techStack
  });
  return happyPathResponse(user);
}

export async function getUsersRelatedToPost({ postId }) {
  const allPosts = await posts.getAllPosts();
  const post = allPosts.find(p => p.id === postId);
  if (!post) return happyPathResponse([]);

  const allReplies = await replies.getAllReplies();
  const repliesForPost = allReplies.filter(r => r.post_id === postId);

  const userIds = new Set();
  if (post.author_id) userIds.add(post.author_id);
  for (const reply of repliesForPost) {
    if (reply.user_id) userIds.add(reply.user_id);
  }

  const users = [];
  for (const userId of userIds) {
    const user = await authentication.getUserById(userId);
    if (user) users.push(user);
  }
  return happyPathResponse(users);
}

export async function updatePost({ postId, title, taskDescription, projectFiles, techStack, removeExistingFiles, cookies }) {
  const callerId = callerIdFromCookies(cookies);
  assert(callerId, 'Authentication required');
  assert(postId, 'Post ID is required');
  
  const validation = await posts.validatePost({ title, taskDescription, techStack });
  if (!validation.success) {
    return validationResponse(validation.errors);
  }
  
  const post = (await posts.getAllPosts()).find(p => p.id === postId);
  assert(post, 'Post not found');
  assert(post.author_id === callerId, 'Not authorized to edit this post');
  
  let projectFilesBuffer = undefined;
  if (projectFiles) {
    projectFilesBuffer = Buffer.from(projectFiles, 'base64');
  }
  
  const updatedPost = await posts.updatePost(
    postId,
    title.trim(),
    taskDescription.trim(),
    projectFilesBuffer,
    techStack,
    removeExistingFiles
  );
  
  return happyPathResponse(updatedPost);
}