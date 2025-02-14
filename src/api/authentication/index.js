const routes = require('./routes');
const AuthenticationHandler = require('./handler');
module.exports = {
  name: 'authentication',
  version: '1.0.0',
  register: async (server, { authenticationService, userService, tokenManager, validator }) => {
    const authenticationHandler = new AuthenticationHandler(authenticationService, userService, tokenManager,  validator);
    server.route(routes(authenticationHandler));
  }

};