/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Menambahkan kolom 'owner' ke tabel 'playlists'
  pgm.addColumn('playlists', {
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // Menambahkan constraint foreign key untuk kolom 'owner'
  pgm.addConstraint(
    'playlists',
    'fk_playlists_owner',
    'FOREIGN KEY(owner) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  // Menghapus constraint foreign key terlebih dahulu
  pgm.dropConstraint('playlists', 'fk_playlists_owner');

  // Menghapus kolom 'owner'
  pgm.dropColumn('playlists', 'owner');
};

