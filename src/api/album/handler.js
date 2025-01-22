class AlbumHandler {

  constructor(service, validate){
    this._service = service;
    this._validate = validate;

    this.addAlbumHandler = this.addAlbumHandler.bind(this);
    this.updateAlbumHandler = this.updateAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
  }


  async addAlbumHandler(request, h){
    this._validate.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const data = await this._service.addAlbum({ name, year });


    const response = h.response({
      status: 'success',
      data: {
        albumId: data
      }
    });

    response.code(201);
    return response;


  }


  async getAlbumByIdHandler(request, h){
    const { id } = request.params;
    const data = await this._service.getAlbumById(id);
    const response = h.response({
      status: 'success',
      data: {
        album: data
      }
    });
    response.code(200);
    return response;


  }
  async updateAlbumHandler(request, h){

    this._validate.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.updateAlbum(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Berhasil mengupdate album'

    });
    response.code(200);
    return response;

  }
  async deleteAlbumHandler(request, h){
    const { id } = request.params;
    await this._service.deleteAlbum(id);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus data album'
    });
    response.code(200);
    return response;

  }
}

module.exports = AlbumHandler;