import { db } from '../database.js';
import * as yup from 'yup';
import { validateWithYup } from '../lib/validationUtils.js';

const postSchema = yup.object({
  title: yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  
  taskDescription: yup.string()
    .required('Task description is required')
    .min(10, 'Task description must be at least 10 characters')
    .max(10000, 'Task description must be at most 10000 characters')
    .trim(),
  
  techStack: yup.array()
    .of(yup.string().required())
    .required('Tech stack is required')
    .max(20, 'Tech stack cannot have more than 20 items')
    .test('unique-items', 'Tech stack cannot have duplicate items', 
      (value) => value ? new Set(value).size === value.length : true
    )
    .test('empty-str-items', 'Tech stack cannot have empty strings', 
      (value) => value ? value.every(item => item.trim() !== '') : true
    )
});

export async function validatePost({ title, taskDescription, techStack }) {
  return await validateWithYup(postSchema, { title, taskDescription, techStack });
}

export async function getAllPosts() {
  const result = await db.query(`
    SELECT id, title, task_description, created_at, author_id,
           (project_files IS NOT NULL) as does_have_project_files,
           tech_stack
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

export async function createPost(title, taskDescription, projectFiles, authorId, techStack) {
  const query = `
    INSERT INTO posts (title, task_description, project_files, author_id, tech_stack) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, title, task_description, created_at, author_id,
             (project_files IS NOT NULL) as does_have_project_files,
             tech_stack
  `;
  const result = await db.query(query, [title, taskDescription, projectFiles, authorId, techStack]);
  return result.rows[0];
}

export async function updatePost(postId, title, taskDescription, projectFiles, techStack, removeExistingFiles) {
  let query;
  let params;

  if (removeExistingFiles) {
    query = `
      UPDATE posts 
      SET title = $1, 
          task_description = $2, 
          project_files = NULL,
          tech_stack = $3
      WHERE id = $4
      RETURNING id, title, task_description, created_at, author_id,
               (project_files IS NOT NULL) as does_have_project_files,
               tech_stack
    `;
    params = [title, taskDescription, techStack, postId];
  } else if (projectFiles !== undefined) {
    query = `
      UPDATE posts 
      SET title = $1, 
          task_description = $2, 
          project_files = $3,
          tech_stack = $4
      WHERE id = $5
      RETURNING id, title, task_description, created_at, author_id,
               (project_files IS NOT NULL) as does_have_project_files,
               tech_stack
    `;
    params = [title, taskDescription, projectFiles, techStack, postId];
  } else {
    query = `
      UPDATE posts 
      SET title = $1, 
          task_description = $2,
          tech_stack = $3
      WHERE id = $4
      RETURNING id, title, task_description, created_at, author_id,
               (project_files IS NOT NULL) as does_have_project_files,
               tech_stack
    `;
    params = [title, taskDescription, techStack, postId];
  }

  const result = await db.query(query, params);
  return result.rows[0];
}