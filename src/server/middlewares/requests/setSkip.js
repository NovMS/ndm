const setSkip = async (req, res) => {

  const { queryPg } = require('./../../services/pg');
  const moment = require('moment');

  const {id, feeds} = req.body;
  const login = req.cookies.login || 'unknown';

  for (let i = 0; i < feeds.length; i++) {
    let q1 = `
      DELETE FROM userdata.ndm_state
      WHERE hash = ${id} AND feed = '${feeds[i]}'
    `;

    await queryPg(res, q1);

    let q2 = `
      INSERT INTO userdata.ndm_state (feed, state, login, updated_at, hash)
      VALUES ('${feeds[i]}', 'skip', '${login}', '${moment().format()}', ${id})
    `;
    await queryPg(res, q2);
    
  }

  res.send({status: 'OK'});
}

module.exports = setSkip;
