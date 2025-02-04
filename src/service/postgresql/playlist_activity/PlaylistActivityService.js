const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../../exceptions/NotFoundError');

class PlaylistActivityService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistActivities(playlistId) {
    const checkPlaylistQuery = {
      text: 'SELECT id FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const checkPlaylistResult = await this._pool.query(checkPlaylistQuery);

    if (checkPlaylistResult.rows.length === 0) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const query = {
      text: `
        SELECT u.username, s.title, pa.action, pa.time
        FROM playlist_song_activities pa
        JOIN users u ON pa.userid = u.id
        JOIN songs s ON pa.songid = s.id
        WHERE pa.playlistid = $1
        ORDER BY pa.time ASC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async createPlaylistActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities (id, playlistid, songid, userid, action, time) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error('Playlist activity gagal ditambahkan');
    }
  }
}

module.exports = PlaylistActivityService;
