class AlbumLikesHandler {
  constructor(albumService, userService, service) {
    this._albumService = albumService;
    this._userService = userService;
    this._service = service;

    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumService.getAlbumById(albumId);
    await this._service.verifyAlreadyLike(credentialId, albumId);
    await this._service.giveLike(credentialId, albumId);

    return h.response({
      status: 'success',
      message: 'Berhasil menyukai album ini!',
    }).code(201);
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumService.getAlbumById(albumId);
    await this._service.verifyLikeExist(credentialId, albumId);
    await this._service.deleteLike(credentialId, albumId);

    return h.response({
      status: 'success',
      message: 'Berhasil membatalkan like pada album',
    }).code(200);
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const { like, source } = await this._service.getLikeCount(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: like,
      },
    });
    if (source === 'cache') {
      response.header('X-Data-Source', 'cache');
    }
    response.code(200);

    return response;
  }
}

module.exports = AlbumLikesHandler;