/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('collabolators', {
    id: {
      type: 'VARCHAR(20)',
      primaryKey: true
    },
    playlistid: {
      type: 'VARCHAR(20)',
      notNull: true,
      references: 'playlists(id)'
    },
    userid: {
      type: 'VARCHAR(20)',
      notNull: true,
      references: 'users(id)'
    }


  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('collaborators');
};
