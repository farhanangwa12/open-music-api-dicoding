const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumlikes',
  version: '1.0.0',
  register: async (server, { albumService, userService, service }) => {
    const albumLikesHandler = new AlbumLikesHandler(
      albumService,
      userService,
      service
    );
    server.route(routes(albumLikesHandler));
  },
};