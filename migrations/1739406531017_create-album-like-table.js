/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    albumid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userid: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  });
  pgm.addConstraint('album_likes', 'fk_album_likes.albumid_albums.id', {
    foreignKeys: {
      columns: 'albumid',
      references: 'albums(id)',
      onDelete: 'CASCADE'
    }
  });

  pgm.addConstraint('album_likes', 'fk_album_likes.userid_users.id', {
    foreignKeys: {
      columns: 'userid',
      references: 'users(id)',
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

  pgm.dropConstraint('album_likes', 'fk_album_likes.albumid_albums.id');
  pgm.dropConstraint('album_likes', 'fk_album_likes.userid_users.id');
  pgm.dropTable('album_likes');

};
