const songByToDbModel = ({ id, title, year, performer, genre, duration, albumid
}) => ({
  id: id,
  title: title,
  year: year,
  performer: performer,
  genre: genre,
  duration: duration,
  albumId: albumid
});


module.exports = { songByToDbModel };