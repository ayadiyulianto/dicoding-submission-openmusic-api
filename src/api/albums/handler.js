const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(
    albumsService,
    albumsValidator,
    storageService,
    uploadsValidator,
  ) {
    this._albumsService = albumsService;
    this._albumsValidator = albumsValidator;
    this._storageService = storageService;
    this._uploadsValidator = uploadsValidator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler =
      this.deleteAlbumByIdHandler.bind(this);
    this.postUploadImageHandler =
      this.postUploadImageHandler.bind(this);
    this.postLikesAlbumHandler =
      this.postLikesAlbumHandler.bind(this);
    this.getAlbumLikesByIdHandler =
      this.getAlbumLikesByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._albumsValidator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this._albumsService.addAlbum({
        name,
        year,
      });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumsHandler(h) {
    try {
      const albums = await this._albumsService.getAlbums();
      return {
        status: 'success',
        data: {
          albums,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._albumsService.getAlbumById(id);
      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._albumsValidator.validateAlbumPayload(request.payload);
      const { id } = request.params;

      await this._albumsService.editAlbumById(id, request.payload);

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._albumsService.deleteAlbumById(id);
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postUploadImageHandler(request, h) {
    try {
      const { id } = request.params;
      const { cover } = request.payload;

      await this._albumsService.isAlbumExist(id);
      this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

      const filename = await this._storageService.writeFile(
        cover,
        cover.hapi,
      );
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;
      await this._albumsService.editAlbumCoverById(id, fileLocation);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postLikesAlbumHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      const message = await this._albumsService.likeTheAlbum(
        id,
        credentialId,
      );
      const response = h.response({
        status: 'success',
        message,
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumLikesByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { likes, source } =
        await this._albumsService.getAlbumLikesById(id);
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.header('X-Data-Source', source);
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
