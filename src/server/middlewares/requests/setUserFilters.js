const setUserFilters = async (req, res) => {

  const { queryPg } = require('./../../services/pg');
  const moment = require('moment');

  const filters = JSON.stringify(req.body) || {};
  const login = req.cookies.login || 'unknown';

  const q = `
    INSERT INTO userdata.ndm_users (filters, login, updated_at)
    VALUES ('${filters}', '${login}', '${moment().format()}')
    ON CONFLICT (login) DO UPDATE SET
    filters = '${filters}', updated_at = '${moment().format()}';
  `;

  await queryPg(res, q);
  res.send({status: 'OK'});
}

module.exports = setUserFilters;
