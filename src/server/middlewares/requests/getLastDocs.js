const getLastDocs = async (req, res) => {

  const { axiosGet } = require('./../../services/axios');
  const { queryPg } = require('./../../services/pg');
  const { sourceTransform } = require('./../../services/translator');
  const moment = require('moment');

  let count = +req.body.count || 20,
        offset = +req.body.offset || 0,
        dateFrom = req.body.dateFrom || '',
        dateTo = req.body.dateTo || '',
        withDouble = +req.body.withDouble || 0,
        status = req.body.status || 'all',
        page = req.body.page || 'ndm';

  let sources = req.body.sources || '{}',
      searchValue = req.body.searchValue || '',
      feeds = req.body.feeds || '{}',
      competitors = req.body.competitors || '{}';
  const login = req.cookies.login || 'unknown';

  if (page == 'ndm') {
    sources = {
      ...JSON.parse(sources),
      ais: false 
    };
  } else if (page == 'ais') {
    sources = {
      ais: true 
    };
    status = 'all';
  } else if (page == 'competitors') {
    sources = {
      ...JSON.parse(competitors),
      ais: false 
    };
    status = 'all';
  }

  feeds = JSON.parse(feeds);
  let sourcesQ = '';
  let feedsQ = '';
  if (searchValue) {
    searchValue = await axiosGet(res, `http://10.106.78.205:80/windows-services/getQueryExtension?query=${encodeURI(searchValue)}`);
  }
    
  for (let prop in feeds) {
    if (feeds[prop]) {
      if (feedsQ.length > 0) {
        feedsQ += `, '${prop}'`
      } else {
        feedsQ += `'${prop}'`
      }
    }
  }

  for (let prop in sources) {
    if (sources[prop]) {
      if (sourcesQ.length > 0) {
        sourcesQ += ` OR source = '${await sourceTransform(res, prop)}'`
      } else {
        sourcesQ += `source = '${await sourceTransform(res, prop)}'`
      }
    }
  }
  
  const getStatusFilter = (status) => {
    switch(status){
      case 'all': return '';
      case 'my': return `AND docs.hash in (select hash from userdata.ndm_state where login='${login}')`; break;
      case 'withMarkup': return `AND docs.hash in (select hash from userdata.ndm_state)`; break;
      case 'withoutMarkup': return `AND not docs.hash in (select hash from userdata.ndm_state)`; break;
      case 'withoutMarkupLents': return `
        AND not docs.hash in (
          SELECT hash
          FROM userdata.ndm_state
          GROUP BY hash
          HAVING (${(feedsQ.length > 0) ? `array_agg(feed) @> ARRAY[${feedsQ}]` : 'true'})
        )
      `; break;
      case 'inWork': return `AND docs.hash in (select hash from userdata.ndm_state where state='inWork')`; break;
      case 'skip': return `AND docs.hash in (select hash from userdata.ndm_state where state='skip')`; break;
      case 'skipLents': return `
        AND docs.hash in (
          SELECT hash 
          FROM userdata.ndm_state
          WHERE state='skip'
            AND (${feedsQ ? `feed = ANY (ARRAY[${feedsQ}])` : 'false'})
        )
      `; break;
      default: return('');
    }
  }

  const q = `
    SELECT title, source, docs.url, publicated_at, comment, docs.hash as id, array_agg(feed) as feed, array_agg(state) as state, array_agg(ndm_state.login), id_ais, indexed_at
    FROM ndm.docs
    LEFT JOIN userdata.ndm_comment on docs.hash = ndm_comment.doc_hash
    LEFT JOIN userdata.ndm_state on docs.hash = ndm_state.hash
    WHERE (${(sourcesQ.length > 0) ? sourcesQ : 'false'})
    AND ${(dateFrom) ? `indexed_at >= '${moment(dateFrom).format('YYYY-MM-DD')}'` : 'true'}
    AND ${(dateTo) ? `indexed_at <= '${moment(dateTo).format('YYYY-MM-DD')}'` : 'true'}
    AND ${(searchValue) ? `(docs.title_index @@ to_tsquery('${searchValue}'))` : 'true'}
    AND ${withDouble ? 'docs.hash in (select hash_doc from userdata.ndm_double)' : 'true'}
    AND not docs.hash in (select hash_double from userdata.ndm_double)
    AND docs.filter
    ${getStatusFilter(status)}
    GROUP BY id, comment
    ORDER BY indexed_at DESC, id desc
    offset ${offset} limit ${count}
  `;

  const rows = await queryPg(res, q);

  if (page != 'competitors') {
    rows.map((row) => {
      row.states = []
      if (row.feed.length>0 && row.feed[0]) {
        row.feed.map((feed, i) => {
          row.states = [
            ...row.states,
            [feed, row.state[i]]
          ]
        })
      }
    })
  }

  res.send(rows);
}

module.exports = getLastDocs;
