const addAis = async (req, res) => {

  const { queryPg } = require('./../../services/pg');
  const { queryMssql } = require('./../../services/mssql');
  const getDocInfo = require('./functions/getDocInfo');
  const moment = require('moment');
  const S = require('string');
  const {lentaTransform} = require('./../../services/translator');
  const { getHash } = require('./../../services/hash');
  const { getTextIndexes } = require('./../../services/text-indexes');

  const {id, feeds} = req.body;
  const login = req.cookies.login || 'unknown';


  const docInfo = await getDocInfo({query: {id: id}}, res);
  let url = docInfo.url;
  let feedsStr = '';
  feeds.map((feed) => {
    feedsStr+=`${lentaTransform(feed)};`
  })

  if (docInfo.url.indexOf('consultantplus://offline/main') != -1) {
    url = `Б=${S(docInfo.url).between('base=', ';')}_Д=${S(docInfo.url).between('n=', ';')}_М=${(docInfo.url.indexOf('dst=') != -1) ? S(docInfo.url).between('dst=', ';') : '100001'}`;
  }

  const qInserToAis = `
    INSERT INTO dbo.OOdoc (doczag,
                           Data,
                           status,
                           docdata,
                           comment,
                           link,
                           lenta,
                           med_mail,
                           smsource,
                           sources)
    VALUES ('${docInfo.title.replace(/'/i, `"`)}',
            '${moment().format('YYYY-MM-DDTHH:mm:ss')}',
            'Взят в работу',
            ${null},
            ${(docInfo.comment) ? `'${docInfo.comment}'` : null},
            ${null},
            '${feedsStr}',
            0,
            'ndm',
            '${JSON.stringify([{title: docInfo.title, source: docInfo.source, url: docInfo.url, docdata: moment(docInfo.publicated_at).add(3, 'h').toISOString() }])}');
    SELECT SCOPE_IDENTITY() as iddoc
  `;

  const recordset = await queryMssql(res, qInserToAis);

  const hash = await getHash([docInfo.title, `${recordset[0].iddoc}`]);

  await queryMssql(res, `
    UPDATE [oip_dpr].[dbo].[OOdoc]
    SET sm_link = 'http://dad-ndm.consultant.ru/markup-ais/${hash}'
    WHERE iddoc = ${recordset[0].iddoc}; 
  `);

  await queryMssql(res, `
    EXEC dbo.oo_checksource ${recordset[0].iddoc};
  `);
 
  const nowDate =  moment().format('YYYYMM');
  await queryPg(res, `
    CREATE TABLE IF NOT EXISTS ndm.docs_${nowDate}_ais() INHERITS (ndm.docs)
  `);

  const { titleIndex, titleStemmIndex } = await getTextIndexes(docInfo.title);
  const qInsert = `
    INSERT INTO ndm.docs_${nowDate}_ais (title, source, url, publicated_at, indexed_at, hash, title_index, title_stemm_index, id_ais, filter)
    VALUES ('${docInfo.title.replace(/'/i, `"`)}',
            'АИС',
            ${null},
            ${null},
            '${moment().format()}',
            ${hash},
            '${titleIndex}',
             to_tsvector('${titleStemmIndex}'),
            ${recordset[0].iddoc},
            ${true})
  `;
  await queryPg(res, qInsert);

  for (let i = 0; i < feeds.length; i++) {
    const qInsertState = `
      INSERT INTO userdata.ndm_state (feed, state, login, updated_at, hash)
      VALUES ('${feeds[i]}', 'inWork', '${login}', '${moment().format()}', ${hash})
    `;
    await queryPg(res, qInsertState);
  }
  
  const setRelative = require('./functions/setRelative');
  await setRelative({
    body: {
      id_ndm: id,
      id_ais: hash,
      iddoc: recordset[0].iddoc,
      feeds: req.body.feeds
    },
    cookies: {
      login: login
    }
  }, res);

  res.send({
    ais: recordset[0].iddoc,
    id: hash
  });
}

module.exports = addAis;
