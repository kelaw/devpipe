const { oracledb, getConnection, closeConnection } = require('./utils/database')

const verifyUser = (username, password) => {
  try {
    const connection = await getConnection()
    const sql = `SELECT * FROM ${schema}.${tableName} where rownum < ${rowLimit}`
    const result = await connection.execute(
      sql,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    )
    console.log(req.user)
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  } finally {
    closeConnection()
  }
}

module.exports = {
    verifyUser
};