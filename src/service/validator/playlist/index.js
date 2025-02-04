const { PlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./schema');
const InvarianError = require('../../../exceptions/InvarianError');

const PlaylistPayloadValidation = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },

};

module.exports = PlaylistPayloadValidation;