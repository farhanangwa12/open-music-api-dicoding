require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const albumPlugin = require('./api/album');
const AlbumServices = require('./service/postgresql/album/AlbumServices');
const AlbumValidator = require('./service/validator/album/index');
const songPlugin = require('./api/song');
const SongServices = require('./service/postgresql/songs/SongServices');
const SongValidator = require('./service/validator/song/index');
const ClientError = require('./exceptions/ClientError');
// const AuthorizationError = require('./exceptions/AuthorizationError');





const authentication = require('./api/authentication');
const AuthenticationService = require('./service/postgresql/authentications/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationPayloadHandlerValidation = require('./service/validator/authentication/index');

const user = require('./api/user');
const UsersService = require('./service/postgresql/user/UsersService');
const UserPayloadValidation = require('./service/validator/user/index');


const playlist = require('./api/playlist');
const PlaylistService = require('./service/postgresql/playlist/PlaylistService');
const PlaylistValidator = require('./service/validator/playlist/index');

const PlaylistActivitiesService = require('./service/postgresql/playlist_activity/PlaylistActivityService');

const collabolator = require('./api/collabolator');
const CollabolatorService = require('./service/postgresql/collabolator/CollabolatorService');
const CollabolatorPayloadValidator = require('./service/validator/collabolator/index');

const exporter = require('./api/export');
const ExportService =  require('./service/rabbitmq/ExportService');
const ExportValidator = require('./service/validator/export/index');


const upload = require('./api/upload/index');
const StorageService = require('./service/storage/StorageService');
const UploadValidator = require('./service/validator/upload/index');

const albumLike = require('./api/album_like');
const AlbumLikeService = require('./service/postgresql/album_like/AlbumLIkeService');


const CacheService = require('./service/redis/CacheService');
const path = require('path');


const init = async () => {


  const albumService = new AlbumServices();
  const songService = new SongServices();
  const userService = new UsersService();
  const authenticationService = new AuthenticationService();
  const collabolatorService = new CollabolatorService();
  const playlistService = new PlaylistService(collabolatorService);
  const playlistActivitiesService = new PlaylistActivitiesService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/upload/file/images'));
  const cacheService = new CacheService();
  const albumLikeService = new AlbumLikeService(cacheService);

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  });



  await server.register([
    {
      plugin: Jwt
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id }
    })
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
      },
      {
        plugin: user,
        options: {
          service: userService,
          validator: UserPayloadValidation
        }
      }, {
        plugin: authentication,
        options: {
          authenticationService,
          userService,
          tokenManager: TokenManager,
          validator: AuthenticationPayloadHandlerValidation
        }
      }, {
        plugin: playlist,
        options: {
          songService,
          playlistActivitiesService,
          service: playlistService,
          validator: PlaylistValidator,
        }
      },
      {
        plugin: collabolator,
        options: {
          playlistService,
          userService,
          service: collabolatorService,
          validator: CollabolatorPayloadValidator
        }
      },
      {
        plugin: exporter,
        options: {
          exportService: ExportService,
          playlistService,
          validator: ExportValidator
        }
      },
      {
        plugin: upload,
        options: {
          albumService,
          storageService,
          validator: UploadValidator
        }
      },
      {
        plugin: albumLike,
        options: {
          albumService,
          userService,
          service: albumLikeService,
        }
      }
    ]
  );

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const errorResponse = h.response({
        status: 'fail',
        message: response.message
      });
      errorResponse.code(response.statusCode);
      return errorResponse;
    }

    if (response.isBoom) {
      switch (response.output.statusCode) {
      case 401: {
        const errorResponse = h.response({
          status: 'fail',
          message: response.output.payload.message
        });
        errorResponse.code(401);
        return errorResponse;
      }
      case 404: {
        const errorResponse = h.response({
          status: 'fail',
          message: response.output.payload.message
        });
        errorResponse.code(404);
        return errorResponse;
      }
      case 413: {
        const errorResponse = h.response({
          status: 'fail',
          message: response.output.payload.message
        });
        errorResponse.code(413);
        return errorResponse;
      }
      case 415: {
        const errorResponse = h.response({
          status: 'fail',
          message: response.output.payload.message
        });
        errorResponse.code(400);
        return errorResponse;
      }
      case 500: {
        console.error(response);
        break;
      }
      default:
        console.log(response);
        break;
      }
    }

    return h.response(response);
  });

  await server.start();

  console.log(`Server berhasil dibuat ${server.info.uri}`);

};

init();

