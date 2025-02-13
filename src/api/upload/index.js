

const routes = require('./routes');
const CoverHandler = require('./handler'); // Pastikan file handler.js sudah ada dan mengimplementasikan method postCoverAlbumHandler

exports.plugin = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { albumService, storageService, validator }) => {
    const coverHandler = new CoverHandler(albumService, storageService, validator);
    server.route(routes(coverHandler));
  }
};
