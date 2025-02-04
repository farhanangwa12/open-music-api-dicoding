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
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlistid: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    userid: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }


  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
