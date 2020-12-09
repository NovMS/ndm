const getUserFilters = async (req, res) => {

  const { queryPg } = require('./../../services/pg');

  const login = req.cookies.login || 'unknown';
  const q = `
    SELECT filters
    FROM userdata.ndm_users
    WHERE login = '${login}'
  `;

  const rows = await queryPg(res, q);

  if (rows.length == 0) {
    res.send({
      feeds: {},
      sources: {},
      competitors: {}
    });
  } else {
    res.send({
      feeds: {},
      sources: {},
      competitors: {},
      ...rows[0].filters
    });
  }
}

module.exports = getUserFilters;
