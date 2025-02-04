const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvarianError');
const NotFoundError = require('../../../exceptions/NotFoundError');
const { songByToDbModel } = require('../../utilis/index');
class SongServices {
  constructor() {
    this._pool = new Pool();
  }


  async addSong({ title, year, genre, performer, duration, albumId }) {

    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO songs (id, title, year, performer, genre,  duration, albumid, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt]
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }


  async getSongs({ title, performer }) {
    const conditionQuery = [];
    const conditionValue = [];
    let finalQuery = '';
    if (title) {

      conditionValue.push(`%${title}%`);
      conditionQuery.push(`title ILIKE $${conditionValue.length}`);
    }
    if (performer){
      conditionValue.push(`%${performer}%`);
      conditionQuery.push(`performer ILIKE $${conditionValue.length}`);
    }
    if (conditionValue.length > 0) {
      finalQuery += ` WHERE ${conditionQuery.join(' AND ')}`;
    }

    const query = {
      text: `SELECT id, title, performer FROM songs ${finalQuery}`,
      values: conditionValue
    };
    const result = await this._pool.query(query);
    return result.rows;  // Mengembalikan array dari semua lagu
  }


  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration, albumid FROM songs WHERE id = $1',
      values: [id]
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Maaf lagu tidak ada');
    }
    // return result.rows[0];  // Mengembalikan lagu berdasarkan ID
    return result.rows.map(songByToDbModel)[0];
  }

  async getSongByAlbum(idAlbum) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE albumid = $1',
      values: [idAlbum]
    };

    const result = await this._pool.query(query);
    // return result.rows[0];  // Mengembalikan lagu berdasarkan ID
    return result.rows;
  }


  async updateSong(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `
        UPDATE songs
        SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumid = $6, updatedat = $7
        WHERE id = $8
        RETURNING id
      `,
      values: [title, year, genre, performer, duration, albumId, updatedAt, id]
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Update lagu gagal, id tidak ada');
    }

  }


  async deleteSong(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Penghapusan Lagu gagal, id tidak ada');
    }
    return result.rows[0].id;  // Mengembalikan id lagu yang dihapus
  }
}

module.exports = SongServices;