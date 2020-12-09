const sql = require("mssql");
const { MssqlError } = require('./custom-errors');
const S = require('string');

const config = {
    user: 'sm_user',
    password: 'sm_user',
    server: '10.106.78.167',
    database: 'oip_dpr',
    options: {
      enableArithAbort: false
    },
    encrypt: false
}

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

const queryMssql = async (res, query) => {
  try {
    await poolConnect;
    const request = pool.request();
    const { recordset } = await request.query(query);
    return recordset;
  } catch (e) {
    res.status(500).send(`Mssql error: ${e.message}`);
    throw new MssqlError({
      message: e.message,
      query: S(query).decodeHTMLEntities().collapseWhitespace().s
    });
  }
}

module.exports = {
  queryMssql
};
