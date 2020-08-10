const dbParams = require('./dbparams.js');

const Pool = require('pg').Pool
const pool = new Pool(dbParams);
pool.connect();

const getUserWithUsername = (username) => {
  return pool.query('SELECT * FROM users WHERE users.username = $1', [username])
    .then((res) => {
      return res.rows[0]
    })
}
const createUser = (body) => {
    const { username, hashed_password } = body
    return pool.query('INSERT INTO users (username, hashed_password) VALUES ($1, $2) RETURNING *', [username, hashed_password]).then((res) => {
      return res.rows[0];
    })
}


module.exports = {
  getUserWithUsername,
  createUser,
}