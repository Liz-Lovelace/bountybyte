import { db } from '../database.js';

export async function getAllReplies() {
  const result = await db.query('SELECT * FROM replies ORDER BY created_at DESC');
  return result.rows;
}

async function validateReplyParent(postId, parentReplyId) {
  if (!parentReplyId) {
    // Check if post exists
    const postResult = await db.query(
      'SELECT id FROM posts WHERE id = $1',
      [postId]
    );
    if (postResult.rows.length === 0) {
      throw new Error('Post not found');
    }
    return true;
  }

  // Check if parent reply exists and belongs to the same post
  const parentResult = await db.query(
    'SELECT id FROM replies WHERE id = $1 AND post_id = $2',
    [parentReplyId, postId]
  );
  
  if (parentResult.rows.length === 0) {
    throw new Error('Parent reply not found or does not belong to the specified post');
  }
  return true;
}

export async function createReply({ postId, parentReplyId, userId, bodyText }) {
  await validateReplyParent(postId, parentReplyId);

  const query = `
    INSERT INTO replies (post_id, parent_reply_id, user_id, body_text) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  
  const result = await db.query(query, [postId, parentReplyId, userId, bodyText]);
  return result.rows[0];
} 