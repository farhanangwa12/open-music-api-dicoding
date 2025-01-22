const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvarianError');
const SongServices = require('../songs/SongServices');
const NotFoundError = require('../../../exceptions/NotFoundError');


class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }


  async addAlbum({ name, year }) {

    // const id = nanoid(16);
    const id = `album-${nanoid(16)}`;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO albums (id, name, year, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt]
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {

      throw new InvariantError('Album Gagal ditambahkan.');

    }

    return result.rows[0].id;


  }


  // Get an album by ID
  async getAlbumById(id) {

    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id]
    };
    const result = await this._pool.query(query);
    // return result.rows[0];
    const resultAlbum = result.rows[0];
    if (!resultAlbum) {
      throw new NotFoundError('Maaf album yang anda cari tidak ada');
    }

    const songService = new SongServices(this._pool);
    const resultSongByAlbum = await songService.getSongByAlbum(id);
    return { ...resultAlbum, songs: resultSongByAlbum };
  }

  async updateAlbum(id, { name, year }) {

    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2, updated_at=$3 WHERE id=$4 RETURNING id',
      values: [name, year, updatedAt, id]
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {

      throw new NotFoundError('Gagal mengupdate album, id tidak ada');

    }

  }
  // Delete an album
  async deleteAlbum(id) {

    const query = {
      text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
      values: [id]
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album, id tidak ada');
    }
  }
}

module.exports = AlbumServices;