
const routes = require('./routes');
const CollaboratorHandler = require('./handler');
module.exports = {
  name: 'collaborators',
  version: '1.0.0',
  register: (server, { playlistService, userService, service, validator }) => {
    const collabolatorHandler = new CollaboratorHandler(playlistService, userService, service, validator);
    server.route(routes(collabolatorHandler));

  }
};