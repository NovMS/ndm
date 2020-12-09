const setInWorkState = async (req, res) => {

  const getStates = require('./functions/getStates');
  const { queryPg } = require('./../../services/pg');
  const { queryMssql } = require('./../../services/mssql');
  const {lentaTransform} = require('./../../services/translator');
  const getRelativesId = require('./functions/getRelativesId');
  const moment = require('moment');
  const S = require('string');

  const {id, iddoc, feeds} = req.body;
  const login = req.cookies.login || 'unknown';

  const q1 = `
    DELETE FROM userdata.ndm_state
    WHERE hash = ${id}
  `;
  await queryPg(res, q1);

  let relatives = await getRelativesId({ query: { id: id } }, res);

  for (let j = 0; j < relatives.length; j++) {
    const qSetRelState = `
      DELETE FROM userdata.ndm_state
      WHERE state = 'inWork' AND hash = ${relatives[j]};
    `;
    await queryPg(res, qSetRelState);
  }

  for (let i = 0; i < feeds.length; i++) {
    const q2 = `
      INSERT INTO userdata.ndm_state (feed, state, login, updated_at, hash)
      VALUES ('${feeds[i]}', 'inWork', '${login}', '${moment().format()}', ${id});
    `;
    await queryPg(res, q2);

    for (let j = 0; j < relatives.length; j++) {
      const qSetRelState = `
        INSERT INTO userdata.ndm_state (feed, state, login, updated_at, hash)
        VALUES ('${feeds[i]}', 'inWork', '${login}', '${moment().format()}', ${relatives[j]});
      `;
      await queryPg(res, qSetRelState);
    }
  
  }

  let feedsStr = '';
  feeds.map((feed) => {
    feedsStr+=`${lentaTransform(feed)};`
  })

  const qSetAisDoc = `
    UPDATE dbo.OOdoc
    SET lenta = '${feedsStr}'
    WHERE iddoc = ${iddoc}
  `;
  await queryMssql(res, qSetAisDoc);

  const states = await getStates({query: {id: id}}, res);

  res.send(states);
}

module.exports = setInWorkState;
