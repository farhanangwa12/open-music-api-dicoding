const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { songService, playlistActivitiesService, service, validator }) => {
    const playlistHandler = new PlaylistHandler(songService, playlistActivitiesService, service, validator);
    server.route(routes(playlistHandler));

  }

};