class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._userService = userService;
    this._authenticationService = authenticationService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostHandlerPayload(request.payload);
    const { username, password } = request.payload;

    const id = await this._userService.verifyUserCredential(username, password);
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken
      },
    });

    response.code(201);
    return response;
  }


  async putAuthenticationHandler(request, h) {
    this._validator.validatePutHandlerPayload(request.payload);

    const { refreshToken } = request.payload;
    const payload = await this._tokenManager.verifyRefreshToken(refreshToken);
    // await this._authenticationService.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken(payload.id);




    const response = h.response({
      status: 'success',
      message: 'Access Token berhasi di perbarui',
      data: {
        accessToken
      }
    });

    response.code(200);

    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteHandlerPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    await this._authenticationService.deleteRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthenticationHandler;