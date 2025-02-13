
class ExportHandler {
  constructor(exportService, playlistService, validator) {
    this._exportService = exportService;
    this._playlistService = playlistService;
    this._validator = validator;
    this.exportingASong = this.exportingASong.bind(this);
  }

  async exportingASong(request, h) {
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    this._validator.validateExportPayload({ playlistId, targetEmail });


    await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
    await this._exportService.sendMessage('export:songs', JSON.stringify({ playlistId, email: targetEmail }));

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses'
    }).code(201);
  }
}
module.exports = ExportHandler;