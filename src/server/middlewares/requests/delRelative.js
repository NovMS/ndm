const delRelative = async (req, res) => {

  const { queryPg } = require('./../../services/pg');
  const { queryMssql } = require('./../../services/mssql');

  let id_ndm = req.body.id_ndm,
      id_ais = req.body.id_ais,
      iddoc = req.body.iddoc,
      url = req.body.url,
      feeds = req.body.feeds || [];

  const q = `
    DELETE FROM userdata.ndm_relatives
    WHERE (hash_doc = ${id_ndm} AND hash_rel_doc = ${id_ais})
      OR (hash_doc = ${id_ais} AND hash_rel_doc = ${id_ndm})
  `;

  await queryPg(res, q);

  const qDel = `
    DELETE FROM userdata.ndm_state
    WHERE hash = ${id_ndm} AND state = 'inWork'
  `;
  await queryPg(res, qDel);

  const qGetSourcesAis = `
    SELECT sources
    FROM oip_dpr.dbo.OOdoc
    WHERE iddoc = ${iddoc}
  `;

  const recordset = await queryMssql(res, qGetSourcesAis);
  let newSources = JSON.parse(recordset[0].sources).filter(item => item.url != url);

  const qSetSourcesAis = `
    UPDATE dbo.OOdoc
    SET sources = '${JSON.stringify(newSources)}'
    WHERE iddoc = ${iddoc}
  `;
  await queryMssql(res, qSetSourcesAis);

  res.send({status: 'OK'});
}

module.exports = delRelative;
