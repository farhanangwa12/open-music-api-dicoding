const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.addAlbumHandler
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.updateAlbumHandler
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumHandler
  }
];

module.exports = routes;
