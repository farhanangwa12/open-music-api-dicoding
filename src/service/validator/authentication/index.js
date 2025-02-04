
const InvariantError = require('../../../exceptions/InvarianError');
const {  postAuthenticationHandlerValidator, putAuthenticationHandlerValidator, deleteAuthenticationHandlerValidator } = require('./schema');
const AuthenticationPayloadHandlerValidation = {
  validatePostHandlerPayload:  (payload) => {
    const validationResult = postAuthenticationHandlerValidator.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutHandlerPayload: (payload) => {
    const validationResult = putAuthenticationHandlerValidator.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteHandlerPayload: (payload) => {
    const validationResult = deleteAuthenticationHandlerValidator.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = AuthenticationPayloadHandlerValidation;