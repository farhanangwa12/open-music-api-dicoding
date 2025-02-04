class PlaylistHandler {
  constructor(songService, playlistActivitiesService, service, validator) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;
    this._playlistActivityService = playlistActivitiesService;

    // Binding methods to maintain 'this' context
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);

  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const id = await this._service.createPlaylist(name, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylist(credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, ownerId);
    await this._service.deletePlaylist(playlistId);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, ownerId);
    await this._songService.getSongById(songId);
    await this._playlistActivityService.createPlaylistActivity(playlistId, songId, ownerId, 'add');
    await this._service.addSongToPlaylist(songId, playlistId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, ownerId);
    const playlistSongs = await this._service.getSongFromPlaylist(playlistId);
    const response = h.response({
      status: 'success',
      data: {
        playlist: playlistSongs,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, ownerId);
    await this._songService.getSongById(songId);
    await this._playlistActivityService.createPlaylistActivity(playlistId, songId, ownerId, 'delete');
    await this._service.deleteSongFromPlaylist(songId, playlistId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    response.code(200);
    return response;
  }



  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;
    // Panggil service untuk mengambil aktivitas playlist
    await this._service.verifyPlaylistOwner(playlistId, ownerId);
    const activities = await this._playlistActivityService.getPlaylistActivities(playlistId);

    return h.response({
      status: 'success',
      data: {
        playlistId: playlistId,
        activities: activities,
      },
    });
  }
}

module.exports = PlaylistHandler;