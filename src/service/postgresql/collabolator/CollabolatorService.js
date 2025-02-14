const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../../exceptions/InvarianError');
const AuthorizationError = require('../../../exceptions/AuthorizationError');

class CollabolatorService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollabolator(playlistId, userId) {
    const id = `collab-${nanoid(12)}`;

    const result = await this._pool.query({
      text: 'INSERT INTO collaborations  (id, playlistid, userid) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    });
    if (result.rows.length === 0) {
      throw new InvariantError('Collabolator gagal disimpan');
    }
    return result.rows[0].id;
  }
  async verifyCollaboratorAccess(playlistId, userId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM collaborations  WHERE playlistid = $1 AND userid = $2',
      values: [playlistId, userId],
    });

    if (result.rows.length === 0) {
      throw new AuthorizationError('Pengguna tidak memiliki akses sebagai kolaborator pada playlist ini');
    }

    return result.rows[0].id;
  }


  async deleteCollabolator(playlistId, userId) {
    // Add logic to delete a collabolator from the database
    // Example:
    const query = {
      text: 'DELETE FROM collaborations  WHERE playlistid = $1 AND userid = $2 RETURNING id',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('Collabolator gagal dihapus');
    }
  }
}

module.exports = CollabolatorService;