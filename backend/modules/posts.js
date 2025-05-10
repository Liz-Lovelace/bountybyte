import { db } from '../database.js';

export async function getAllPosts() {
  const result = await db.query(`
    SELECT id, title, task_description, created_at, author_id,
           (project_files IS NOT NULL) as does_have_project_files 
    FROM posts 
    ORDER BY created_at DESC
  `);
  return result.rows;
}

export async function getProjectFiles(postId) {
  const result = await db.query(
    'SELECT project_files FROM posts WHERE id = $1',
    [postId]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0].project_files;
}

export async function createPost(title, taskDescription, projectFiles, authorId) {
  const query = `
    INSERT INTO posts (title, task_description, project_files, author_id) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, title, task_description, created_at, author_id,
             (project_files IS NOT NULL) as does_have_project_files
  `;
  const result = await db.query(query, [title, taskDescription, projectFiles, authorId]);
  return result.rows[0];
}