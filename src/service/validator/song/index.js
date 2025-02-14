const InvariantError = require('../../../exceptions/InvarianError');
const { SongPayloadSchema } = require('./schema');



const songValidator = {
  validateSongPayload: (payload) => {

    const validationResult = SongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);

    }

  },

};

module.exports = songValidator;