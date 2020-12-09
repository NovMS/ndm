const setStates = async (req, res) => {

  const getStates = require('./functions/getStates');
  const { queryPg } = require('./../../services/pg');
  const moment = require('moment');
  const S = require('string');

  const {id, feed, state} = req.body;
  const login = req.cookies.login || 'unknown';

  const q1 = `
    DELETE FROM userdata.ndm_state
    WHERE hash = ${id} AND feed = '${feed}'
  `;

  await queryPg(res, q1);

  if (state && state != 'false') {
    const q2 = `
      INSERT INTO userdata.ndm_state (feed, state, login, updated_at, hash)
      VALUES ('${feed}', '${state}', '${login}', '${moment().format()}', ${id})
    `;
    await queryPg(res, q2);
  }

  const states = await getStates({query: {id: id}}, res);

  res.send(states);
}

module.exports = setStates;
