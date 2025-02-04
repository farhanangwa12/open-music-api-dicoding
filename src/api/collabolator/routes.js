const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollabolatorHandler,
    options: {
      auth: 'open_music_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollabolatorHandler,
    options: {
      auth: 'open_music_jwt'
    }
  }
];

module.exports = routes;