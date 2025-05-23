module.exports.up = function(pgm) {
  pgm.sql(`
    ALTER TABLE posts
    ADD COLUMN tech_stack TEXT[] NOT NULL DEFAULT '{}';
  `);
};

module.exports.down = function(pgm) {
  pgm.sql(`
    ALTER TABLE posts
    DROP COLUMN tech_stack;
  `);
};
