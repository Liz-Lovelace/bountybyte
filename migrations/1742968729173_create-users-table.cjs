module.exports.up = function(pgm) {
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  
  pgm.sql(`
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT users_username_unique UNIQUE (username),
      CONSTRAINT users_email_unique UNIQUE (email)
    )
  `);
  
  pgm.sql(`CREATE INDEX idx_users_username ON users (username)`);
  pgm.sql(`CREATE INDEX idx_users_email ON users (email)`);
  pgm.sql(`CREATE INDEX idx_users_created_at ON users (created_at DESC)`);
}

module.exports.down = function(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS users`);
}
