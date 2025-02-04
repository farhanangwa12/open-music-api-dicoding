const InvarianError = require('../../../exceptions/InvarianError');
const { CollaboratorPayloadSchema } = require('./schema');
const CollabolatorPayloadValidator = (payload) => {
  const validationResult = CollaboratorPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvarianError(validationResult.error.message);
  }
};

module.exports = CollabolatorPayloadValidator;