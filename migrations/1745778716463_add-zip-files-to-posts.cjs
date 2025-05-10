module.exports.up = function(pgm) {
  pgm.sql(`
    ALTER TABLE posts
    ADD COLUMN project_files BYTEA
  `);
}

module.exports.down = function(pgm) {
  pgm.sql(`
    ALTER TABLE posts
    DROP COLUMN project_files
  `);
}
