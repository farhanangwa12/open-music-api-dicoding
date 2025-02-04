
class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;


    this.addUserHandler = this.addUserHandler.bind(this);


  }

  async addUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.createUser({ username, password, fullname });
    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan pengguna',
      data: {
        userId
      }
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;