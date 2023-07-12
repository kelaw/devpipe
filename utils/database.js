require('dotenv').config()

const oracledb = require('oracledb')
const { log } = require('./logger')

oracledb.fetchAsString = [oracledb.CLOB]
oracledb.autoCommit = true

const getConnection = async () => {
  try {
    return await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_NAME
    })   
  } catch (error) {
    log(error)
    return new Promise((resolve, reject) => {
      reject(error);
    })
  }
}

const closeConnection = async connection => {
  if (connection) {
    try {
      await connection.close();
    } catch (error) {
      log(error)
    }
  }
}

module.exports = {
  oracledb,
  getConnection,
  closeConnection
}
