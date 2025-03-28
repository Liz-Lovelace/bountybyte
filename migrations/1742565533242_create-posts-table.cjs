module.exports.up = function(pgm) {
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  
  pgm.sql(`
    CREATE TABLE posts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      task_description TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  
  pgm.sql(`CREATE INDEX idx_posts_created_at ON posts (created_at DESC)`);
}

module.exports.down = function(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS posts`);
}