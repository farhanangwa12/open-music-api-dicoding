const Joi = require('joi');

const  postAuthenticationHandlerValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),


});

const putAuthenticationHandlerValidator = Joi.object({
  refreshToken: Joi.string().required(),
});

const deleteAuthenticationHandlerValidator = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { postAuthenticationHandlerValidator, putAuthenticationHandlerValidator, deleteAuthenticationHandlerValidator };
