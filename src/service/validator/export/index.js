const InvariantError = require('../../../exceptions/InvarianError');
const { ExportPayloadSchema } = require('./schema');

const ExportValidator = {
  validateExportPayload(payload) {
    const validationResult = ExportPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = ExportValidator;