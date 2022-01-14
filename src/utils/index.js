/* eslint-disable camelcase */

const mapSongDBToModel = ({ album_id, ...args }) => ({
  ...args,
  albumId: album_id,
});

const mapAlbumDBToModel = ({ cover_url, ...args }) => ({
  ...args,
  coverUrl: cover_url,
});

module.exports = { mapSongDBToModel, mapAlbumDBToModel };
