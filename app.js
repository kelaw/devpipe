require('dotenv').config()
const express = require('express')
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser')
const axios = require('axios')
const { oracledb, getConnection, closeConnection } = require('./utils/database')
const verifyToken = require('./middleware').verifyToken;
const jwt = require('jsonwebtoken')


const rowLimit = process.env.ROW_LIMIT
const app = express()
const port = 3443
const secret = 'testing';
//const token = jwt.sign(payload, secret);


//app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())

app.get('/login', (req, res) => {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name || !credentials.pass) {
    res.status(401).send('Unauthorized');
    return;
  }

  const { name, pass } = credentials;

  // TODO: Authenticate user credentials against database or other data store
  const user = { name: name, pass: pass };

  // Generate JWT token with user info and secret key
  const token = jwt.sign(user, secret);

  // Return token as response
  res.json({ token });

})

app.get('/api/:schema/:tableName', verifyToken, async (req, res) => {
  const tableName = req.params.tableName
  const schema = req.params.schema
  
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
});


app.listen(port, () => {
  console.log(`Inbound Message Reroute app listening on port ${port}`)
})
