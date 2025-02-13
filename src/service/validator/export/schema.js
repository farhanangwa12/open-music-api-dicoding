const Joi = require('joi');

const ExportPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { ExportPayloadSchema };