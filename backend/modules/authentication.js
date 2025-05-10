import { db } from '../database.js';
import * as yup from 'yup';
import * as cryptography from '../lib/cryptography.js';
import { validateWithYup } from '../lib/validationUtils.js';

const userSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .matches(/^[a-zA-Z0-9._\-!#$%^&*()+=<>?/\[\]{}|~]*$/, 'Username contains forbidden characters')
    .max(30, 'Username is too long')
    .test('unique', 'Username is already taken', async function(value) {
      if (!value) return true;
      const result = await db.query(
        'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
        [value]
      );
      return result.rows.length === 0;
    }),
  
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .test('unique', 'Email is already registered', async function(value) {
      if (!value) return true;
      const result = await db.query(
        'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
        [value]
      );
      return result.rows.length === 0;
    }),
  
  password: yup.string()
    .required('Password is required')
    .min(15, 'Too short! Password must be at least 15 characters long')
    .max(1024, 'Too long! Password must be less than 1024 characters long'),
  
  repeatPassword: yup.string()
    .required('Please repeat your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

export async function validateNewUser(user) {
  return await validateWithYup(userSchema, user);
}

export async function createUser({username, email, password}) {
  let { success } = await validateNewUser({username, email, password, repeatPassword: password});
  if (!success) {
    throw new Error('Invalid user info');
  }
  
  let passwordHash = await cryptography.hashPassword(password);
  
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  
  const result = await db.query(query, [username, email, passwordHash]);
  return result.rows[0].id;
}

const loginSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .test('userExists', 'No account found with this email', async function(value) {
      let user = await db.query(
        'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
        [value]
      );
      return user.rows.length > 0;
    }),
  
  password: yup.string()
    .required('Password is required')
    .test('passwordCorrect', 'Wrong password', async function(value) {
      let user = await db.query(
        'SELECT id, password_hash FROM users WHERE LOWER(email) = LOWER($1)',
        [this.parent.email]
      );
      if (user.rows.length === 0) {
        return true;
      }
      return await cryptography.isPasswordCorrect(value, user.rows[0].password_hash);
    }),
});

export async function validateLogin(credentials) {
  return await validateWithYup(loginSchema, credentials);
}

export async function getAuthJWT({userId, password}) {
  let user = await db.query(
    'SELECT id, password_hash FROM users WHERE id = $1',
    [userId]
  );
  if (user.rows.length === 0) {
    throw new Error('User not found');
  }

  if (await cryptography.isPasswordCorrect(password, user.rows[0].password_hash)) {
    return cryptography.signJWT({version: 1, userId: user.rows[0].id});
  } else {
    throw new Error('Wrong password, you should have validated it first');
  }
}

export function callerIdFromJWT(jwt) {
  if (!jwt) {
    return null;
  }
  let parsedJWT = cryptography.parseJWT(jwt);
  if (!parsedJWT) {
    return null;
  }
  return parsedJWT.userId;
}

export async function getUserById(userId) {
  const query = 'SELECT id, username, email, created_at, bio, tech_stack FROM users WHERE id = $1';
  const result = await db.query(query, [userId]);
  const user = result.rows[0];
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    created_at: user.created_at,
    bio: user.bio,
    tech_stack: user.tech_stack
  };
}

export async function getUserByEmail(email) {
  const query = 'SELECT id, username, email FROM users WHERE LOWER(email) = LOWER($1)';
  const result = await db.query(query, [email]);
  const user = result.rows[0];
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
}

const profileUpdateSchema = yup.object({
  bio: yup.string()
    .required('Bio is required')
    .max(3000, 'Bio must be at most 3000 characters'),
  techStack: yup.string()
    .required('Tech stack is required')
    .max(1000, 'Tech stack must be at most 1000 characters')
});

export async function validateProfileUpdate({ bio, techStack }) {
  return await validateWithYup(profileUpdateSchema, { bio, techStack });
}

export async function updateUserProfile({ userId, bio, techStack }) {
  await db.query(
    'UPDATE users SET bio = $1, tech_stack = $2 WHERE id = $3',
    [bio, techStack, userId]
  );
  return getUserById(userId);
}