const { UserPayloadSchema } = require('./schema');

const InvarianError = require('../../../exceptions/InvarianError');


const UserPayloadValidation = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },

};

module.exports = UserPayloadValidation;