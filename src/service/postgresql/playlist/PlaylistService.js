const { Pool } = require('pg');
const InvarianError = require('../../../exceptions/InvarianError');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../../exceptions/NotFoundError');
const AuthorizationError = require('../../../exceptions/AuthorizationError');
class PlaylistService {
  constructor(collabolatorService) {
    this._pool = new Pool();
    this._collabolatorService = collabolatorService;
  }


  async createPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvarianError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylist(owner) {

    const query =
    {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
              LEFT JOIN users ON users.id = playlists.owner 
              LEFT JOIN collaborations ON collaborations.playlistid = playlists.id
              WHERE playlists.owner = $1 OR collaborations.userid = $1`, values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvarianError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }



  async verifyPlaylistOwner(id, owner) {
    const result = await this.playlistById(id);
    const { owner: ownerPlaylist } = result.rows[0];
    if (ownerPlaylist !== owner) {
      throw new AuthorizationError('Anda tidak berhak terhadap resource ini.');
    }
  }

  async verifyPlaylistAccess(id, owner) {
    try {
      await this.verifyPlaylistOwner(id, owner);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      // Jika terjadi error selain NotFoundError, langsung verifikasi kolaborator
      await this._collabolatorService.verifyCollaboratorAccess(id, owner);
    }
  }


  async playlistById(id) {
    const query = {
      text: 'SELECT id, owner FROM playlists WHERE id = $1',
      values: [id]
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result;
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs (id,songid, playlistid) VALUES($1, $2, $3) RETURNING id',
      values: [id, songId, playlistId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvarianError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongFromPlaylist(id) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.id = $1`,
      values: [id]
    };

    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
             LEFT JOIN playlistsongs ON songs.id = playlistsongs.songid
             WHERE playlistsongs.playlistid = $1`,
      values: [id],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);
    const resultSongs = await this._pool.query(querySongs);

    const playlist = resultPlaylist.rows[0];
    playlist.songs = resultSongs.rows;

    return playlist;
  }


  async deleteSongFromPlaylist(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE songid = $1 AND playlistid = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvarianError('Lagu gagal dihapus dari playlist');
    }
  }


}

module.exports = PlaylistService;