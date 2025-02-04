const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../exceptions/AuthenticationError');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvarianError');
const NotFoundError = require('../../../exceptions/NotFoundError');
class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async createUser({ username, password, fullname }) {

    const queryCheckUsername = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    };
    const checkIfUsernameExist = await this._pool.query(queryCheckUsername);
    if (checkIfUsernameExist.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;


  }

  async userById(id){
    const query = {
      text: 'SELECT username FROM users WHERE id = $1',
      values: [id]
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Tidak dapat menemukan user');
    }
    return result;
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }

}

module.exports = UsersService;