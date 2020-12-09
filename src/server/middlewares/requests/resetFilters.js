const resetFilters = async (req, res) => {

  const { queryPg } = require('./../../services/pg');

  const q = `
    SELECT login, filters, updated_at
    FROM userdata.ndm_users;
  `;

  let result = await queryPg(res, q);
  result.map((item) => {
    if (item.filters.sources['gd_pp']) {
      console.log(item.login);
    }
  })
  //console.log(result);
  res.send({status: 'OK'});
}

module.exports = resetFilters;
