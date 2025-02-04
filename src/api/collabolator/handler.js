class CollabolatorHandler {
  constructor(playlistService, userService, service, validator) {
    this._playlistService = playlistService;
    this._userService = userService;
    this._service = service;
    this._validator = validator;

    this.postCollabolatorHandler = this.postCollabolatorHandler.bind(this);
    this.deleteCollabolatorHandler = this.deleteCollabolatorHandler.bind(this);
  }


  async postCollabolatorHandler(request, h){

    const { playlistId, userId } = request.payload;
    const { id: ownerId } = request.auth.credentials;
    await this._userService.userById(userId);
    await this._playlistService.verifyPlaylistAccess(playlistId, ownerId);
    await this._playlistService.playlistById(playlistId);
    const id = await this._service.addCollabolator(playlistId, userId);
    const response = h.response({
      status: 'success',
      data: {
        collaborationId: id
      }

    });
    response.code(201);
    return response;

  }
  async deleteCollabolatorHandler(request, h){
    const { playlistId, userId } = request.payload;
    const { id: ownerId } = request.auth.credentials;
    await this._userService.userById(userId);
    await this._playlistService.playlistById(playlistId);
    await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
    await this._service.deleteCollabolator(playlistId, userId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus hak akses collabolator dari playlist'
    });
    response.code(200);
    return response;
  }
}

module.exports = CollabolatorHandler;