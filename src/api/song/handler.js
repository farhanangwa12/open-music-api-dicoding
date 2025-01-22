class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addSongHandler = this.addSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.updateSongHandler = this.updateSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
  }


  async addSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } = request.payload;
    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId: songId
      }
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title = null, performer=null } = request.query;
    const songs = await this._service.getSongs({ title, performer });
    const response = h.response({
      status: 'success',
      data: {
        songs: songs
      }
    });
    response.code(200);

    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const song = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: {
        song: song
      }
    });
    response.code(200);

    return response;
  }

  async updateSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } = request.payload;
    await this._service.updateSong(id, { title, year, genre, performer, duration, albumId });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diupdate',
    });
    response.code(200);
    return response;
  }

  async deleteSongHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSong(id);


    // Mengembalikan response sukses dengan kode status 200
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });

    response.code(200);
    return response;
  }
}

module.exports = SongHandler;
