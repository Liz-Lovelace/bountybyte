module.exports.up = function(pgm) {
  pgm.sql(`
    ALTER TABLE users
    DROP COLUMN tech_stack,
    ADD COLUMN tech_stack TEXT[] NOT NULL DEFAULT '{}';
  `);
};

module.exports.down = function(pgm) {
  pgm.sql(`
    ALTER TABLE users
    DROP COLUMN tech_stack,
    ADD COLUMN tech_stack TEXT NOT NULL DEFAULT '';
  `);
};
