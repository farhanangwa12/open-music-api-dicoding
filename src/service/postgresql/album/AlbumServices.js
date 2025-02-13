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
      text: 'INSERT INTO albums (id, name, year, createdat, updatedat) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt]
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {

      throw new InvariantError('Album Gagal ditambahkan.');

    }

    return result.rows[0].id;


  }

  async getAlbumById(id) {

    const query = {
      text: 'SELECT id, name, year, cover as "coverUrl" FROM albums WHERE id = $1',
      values: [id]
    };
    const result = await this._pool.query(query);
    // return result.rows[0];
    let resultAlbum = result.rows[0];


    if (!resultAlbum) {
      throw new NotFoundError('Maaf album yang anda cari tidak ada');
    }
    if (resultAlbum.coverUrl !== null) {
      const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${resultAlbum.coverUrl}`;
      resultAlbum = { ...resultAlbum, coverUrl: coverUrl };
    }
    const songService = new SongServices(this._pool);
    const resultSongByAlbum = await songService.getSongByAlbum(id);
    return { ...resultAlbum, songs: resultSongByAlbum };
  }

  async updateAlbum(id, { name, year }) {

    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2, updatedat=$3 WHERE id=$4 RETURNING id',
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

  async updateCoverAlbum(id, cover) {
    // Periksa apakah album dengan ID yang diberikan ada
    const queryCheck = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(queryCheck);

    if (result.rowCount === 0) {
      // Jika album tidak ditemukan, lemparkan NotFoundError
      throw new NotFoundError('Maaf, album yang Anda cari tidak ditemukan');
    }
    // Jika album ditemukan, perbarui kolom cover
    const queryUpdate = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2',
      values: [cover, id],
    };
    await this._pool.query(queryUpdate);
  }
}

module.exports = AlbumServices;