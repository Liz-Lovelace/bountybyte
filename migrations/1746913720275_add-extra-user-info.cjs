module.exports.up = function(pgm) {
  pgm.sql(`
    ALTER TABLE users
    ADD COLUMN bio TEXT NOT NULL DEFAULT '',
    ADD COLUMN tech_stack TEXT NOT NULL DEFAULT '';
  `);
};

module.exports.down = function(pgm) {
  pgm.sql(`
    ALTER TABLE users
    DROP COLUMN IF EXISTS bio,
    DROP COLUMN IF EXISTS tech_stack;
  `);
};
