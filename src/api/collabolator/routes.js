const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollabolatorHandler
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollabolatorHandler
  }
];

module.exports = routes;