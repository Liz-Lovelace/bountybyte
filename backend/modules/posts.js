import { db } from '../database.js';

export async function getAllPosts() {
  const result = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
  return result.rows;
}

export async function createPost(title, taskDescription) {
  const query = `
    INSERT INTO posts (title, task_description) 
    VALUES ($1, $2) 
    RETURNING *
  `;
  
  const result = await db.query(query, [title, taskDescription]);
  return result.rows[0];
} 