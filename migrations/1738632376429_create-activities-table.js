/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    userid: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)', // menghubungkan ke kolom id pada tabel user
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    songid: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'songs(id)', // menghubungkan ke kolom id pada tabel song
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    playlistid: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)', // menghubungkan ke kolom id pada tabel playlist
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    action: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP WITH TIME ZONE',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
