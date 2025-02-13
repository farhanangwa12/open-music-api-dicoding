class UploadHandler {
  constructor(albumService, storageService, validator){
    this._albumService = albumService;
    this._storageService = storageService;
    this._validator = validator;
    this.postCoverAlbumHandler = this.postCoverAlbumHandler.bind(this);
  }
  async postCoverAlbumHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    this._albumService.updateCoverAlbum(id, filename);

    // Lakukan operasi penyimpanan file di sini

    return h.response({
      'status': 'success',
      'message': 'Sampul berhasil diunggah'
    }).code(201);
  }
}

module.exports = UploadHandler;