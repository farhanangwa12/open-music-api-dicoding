const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvarianError');
const { Pool } = require('pg');
const NotFoundError = require('../../../exceptions/NotFoundError');
class AlbumLikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async verifyAlreadyLike(userId, albumId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE userid = $1 AND albumid = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Mohon maaf, anda sudah menyukai album ini.');
    }
  }
  async verifyLikeExist(userId, albumId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE userid = $1 AND albumid = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Mohon maaf anda belum like atau album tidak ada.');
    }
  }


  async giveLike(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album_likes (id, userid, albumid) VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    await this._pool.query(query);
    this._cacheService.delete('like:album');
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE userid = $1 AND albumid = $2',
      values: [userId, albumId],
    };

    await this._pool.query(query);
    this._cacheService.delete('like:album');
  }

  async getLikeCount(albumId) {

    try {
      const data = await this._cacheService.get('like:album');
      return {
        source: 'cache',
        like: JSON.parse(data)
      };
    } catch (error) {
      console.error(error);
      const query = {
        text: 'SELECT COUNT(id)::int AS "likeCount" FROM album_likes WHERE albumid = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const { likeCount } = result.rows[0];
      await this._cacheService.set('like:album', JSON.stringify(likeCount), 1800);
      return {
        like: likeCount,
        source: 'database',
      };
    }

  }
}

module.exports = AlbumLikeService;