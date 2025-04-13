module.exports.up = function(pgm) {
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  
  pgm.sql(`
    CREATE TABLE replies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      post_id UUID NOT NULL,
      parent_reply_id UUID,
      user_id UUID NOT NULL,
      body_text TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_post
        FOREIGN KEY (post_id)
        REFERENCES posts (id),
      CONSTRAINT fk_parent_reply
        FOREIGN KEY (parent_reply_id)
        REFERENCES replies (id),
      CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
    )
  `);
  
  pgm.sql(`CREATE INDEX idx_replies_post_id ON replies (post_id)`);
  pgm.sql(`CREATE INDEX idx_replies_parent_reply_id ON replies (parent_reply_id)`);
  pgm.sql(`CREATE INDEX idx_replies_user_id ON replies (user_id)`);
  pgm.sql(`CREATE INDEX idx_replies_created_at ON replies (created_at DESC)`);
}

module.exports.down = function(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS replies`);
} 