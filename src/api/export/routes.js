

const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.exportingASong,
    options: {
      auth: 'open_music_jwt'
    }
  }
];
module.exports = routes;