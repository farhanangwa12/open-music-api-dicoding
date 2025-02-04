const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class PlaylistActivityService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `
        SELECT u.username, s.title, pa.action, pa.time
        FROM playlist_activities pa
        JOIN "user" u ON pa.userid = u.id
        JOIN song s ON pa.songid = s.id
        WHERE pa.playlistid = $1
        ORDER BY pa.time DESC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async createPlaylistActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_activities (id, playlistid, songid, userid, action, time) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error('Playlist activity gagal ditambahkan');
    }
  }
}

module.exports = PlaylistActivityService;
