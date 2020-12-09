const setRelative = async (req, res) => {

  const { queryPg } = require('./../../../services/pg');
  const moment = require('moment');
  const { queryMssql } = require('./../../../services/mssql');
  const getDocInfo = require('./getDocInfo');

  let id_ndm = req.body.id_ndm,
      id_ais = req.body.id_ais,
      iddoc = req.body.iddoc,
      login = req.cookies.login || 'unknown',
      feeds = req.body.feeds || [];

  const q = `
    INSERT INTO userdata.ndm_relatives (hash_doc, hash_rel_doc, login, updated_at)
    VALUES ('${id_ais}', '${id_ndm}', '${login}', '${moment().format()}')
  `;
  await queryPg(res, q);


  for (let i = 0; i < feeds.length; i++) {
    const qDel = `
      DELETE FROM userdata.ndm_state
      WHERE hash = ${id_ndm} AND feed = '${feeds[i]}'
    `;
    await queryPg(res, qDel);

    const qInsertFeed = `
      INSERT INTO userdata.ndm_state (feed, state, login, updated_at, hash)
      VALUES ('${feeds[i]}', 'inWork', '${login}', '${moment().format()}', ${id_ndm})
    `;
    await queryPg(res, qInsertFeed);
  }

  const qGetSourcesAis = `
    SELECT sources
    FROM oip_dpr.dbo.OOdoc
    WHERE iddoc = ${iddoc}
  `;

  const recordset = await queryMssql(res, qGetSourcesAis);
  const docInfo = await getDocInfo({query: {id: id_ndm}}, res);
  const newItem = {
    title: docInfo.title,
    source: docInfo.source,
    url: docInfo.url,
    docdata: moment(docInfo.publicated_at).add(3, 'h').toISOString()
  };

  let newSources = [];
  if (recordset[0].sources) {
    newSources = [...JSON.parse(recordset[0].sources), newItem]
  } else {
    newSources.push(newItem);
  }
  
  const qSetSourcesAis = `
    UPDATE dbo.OOdoc
    SET sources = '${JSON.stringify(newSources)}'
    WHERE iddoc = ${iddoc};

    EXEC dbo.oo_checksource ${iddoc};
  `;
  await queryMssql(res, qSetSourcesAis);

  return ({status: 'OK'});
}

module.exports = setRelative;
