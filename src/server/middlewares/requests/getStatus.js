const getStatus = async(req, res) => {

  const { queryPg } = require('./../../services/pg');
  const {sourceTransform} = require('./../../services/translator');
  const moment = require('moment');
  const date = moment(new Date(req.query.date)).format('YYYY-MM-DD');
  const nextDate = moment(new Date(req.query.date)).add(1, 'd').format('YYYY-MM-DD');

  let result = {};

  const allParsersQuery = `
    SELECT parser
    FROM ndm.status
    GROUP BY parser
  `;
  let allParsers = await queryPg(res, allParsersQuery);

  for (let i = 0; i < allParsers.length; i++) {
    const statQuery = `
      SELECT status, error, inserted, duplicated, indexed_at
      FROM ndm.status
      WHERE parser = '${allParsers[i].parser}'
      ORDER BY indexed_at desc
      LIMIT 1
    `;
    let stat = await queryPg(res, statQuery);
    result[allParsers[i].parser] = stat[0];

    const countQuery = `
      SELECT count(source) as count
      FROM ndm.docs
      WHERE (indexed_at > '${date}' AND indexed_at < '${nextDate}') AND filter = true AND source = '${await sourceTransform(res, allParsers[i].parser)}'
      GROUP BY source
    `;
    let count = await queryPg(res, countQuery);
    if (count.length > 0) {
      result[allParsers[i].parser].count = count[0].count;
    } else {
      result[allParsers[i].parser].count = '0';
    }
    
  }

  res.send(result);
}

module.exports = getStatus;
