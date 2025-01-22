require('dotenv').config();
const Hapi = require('@hapi/hapi');

const albumPlugin = require('./api/album');
const AlbumServices = require('./service/postgresql/album/AlbumServices');
const AlbumValidator = require('./service/validator/album/index');
const songPlugin = require('./api/song');
const SongServices = require('./service/postgresql/songs/SongServices');
const SongValidator = require('./service/validator/song/index');
const ClientError = require('./exceptions/ClientError');

const init = async () => {


  const albumService = new AlbumServices();
  const songService = new SongServices();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  });


  await server.register(
    [
      {
        plugin: albumPlugin,
        options: {
          service: albumService,
          validator: AlbumValidator
        }
      },
      {
        plugin: songPlugin,
        options: {
          service: songService,
          validator: SongValidator
        }
      }
    ]
  );

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof ClientError) {
      console.log(response, response.message);

      const errorResponse = h.response({
        status: 'fail',
        message: response.message
      });
      errorResponse.code(response.statusCode);
      return errorResponse;
    }

    // Mengembalikan response yang sudah ada
    return h.response(response);
  });

  await server.start();

  console.log(`Server berhasil dibuat ${server.info.uri}`);

};

init();

