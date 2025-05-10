module.exports.up = async function(pgm) {
  // 1. Add the column as nullable first
  await pgm.db.query(`
    ALTER TABLE posts
    ADD COLUMN author_id UUID
      REFERENCES users(id)
      ON DELETE CASCADE
  `);

  // 2. Check if there are any posts
  const { rows: postRows } = await pgm.db.query('SELECT id FROM posts LIMIT 1');
  if (postRows.length > 0) {
    // 3. Get the first user
    const { rows: userRows } = await pgm.db.query('SELECT id FROM users ORDER BY created_at ASC LIMIT 1');
    if (userRows.length === 0) {
      throw new Error('Cannot set author_id on existing posts: no users exist');
    }
    const firstUserId = userRows[0].id;
    // 4. Set all posts' author_id to the first user's id
    await pgm.db.query('UPDATE posts SET author_id = $1 WHERE author_id IS NULL', [firstUserId]);
  }

  // 5. Now set NOT NULL constraint
  await pgm.db.query(`
    ALTER TABLE posts
    ALTER COLUMN author_id SET NOT NULL
  `);
};

module.exports.down = async function(pgm) {
  await pgm.db.query(`
    ALTER TABLE posts
    DROP COLUMN IF EXISTS author_id
  `);
};
