const getNextDoc = async (req, res) => {

  const { queryPg } = require('./../../services/pg');
  const { sourceTransform } = require('./../../services/translator');

  let feeds = {}, sources = {};

  const login = req.cookies.login || 'unknown';

  const filters = await queryPg(res, `
    SELECT filters
    FROM userdata.ndm_users
    WHERE login = '${login}'
  `);

  if (filters.length > 0) {
    feeds = filters[0].filters.feeds;
    sources = filters[0].filters.sources;
  }

  let prevId = req.query.id;
  let sourcesQ = '';

  for (let prop in sources) {
    if (sources[prop]) {
      if (sourcesQ.length > 0) {
        sourcesQ += ` OR source = '${await sourceTransform(res, prop)}'`
      } else {
        sourcesQ += `source = '${await sourceTransform(res, prop)}'`
      }
    }
  }

  let feedsQ = '';
  for (let prop in feeds) {
    if (feeds[prop]) {
      if (feedsQ.length > 0) {
        feedsQ += `, '${prop}'`
      } else {
        feedsQ += `'${prop}'`
      }
    }
  }

  const q = `
    SELECT title, source, docs.url, publicated_at, indexed_at, comment, docs.hash as id, array_agg(feed) as feed, array_agg(state) as state, id_ais, indexed_at
    FROM ndm.docs
    LEFT JOIN userdata.ndm_comment on docs.hash = ndm_comment.doc_hash
    LEFT JOIN userdata.ndm_state on docs.hash = ndm_state.hash
    WHERE (${(sourcesQ.length > 0) ? sourcesQ : 'false'})
    AND not docs.hash in (
      SELECT hash
      FROM userdata.ndm_state
      GROUP BY hash
      HAVING (${(feedsQ.length > 0) ? `array_agg(feed) @> ARRAY[${feedsQ}]` : 'true'})
    )
    AND not docs.hash in (select hash_double from userdata.ndm_double)
    AND docs.filter
    ${prevId ? `AND docs.hash != ${prevId}` : ''}
    GROUP BY id, comment
    ORDER BY indexed_at DESC, id desc
    limit 1
  `;

  const rows = await queryPg(res, q);

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

  if (rows[0] && rows[0].id) {
    res.send({id: rows[0].id});
  } else {
    res.send({id: null});
  }
  
}

module.exports = getNextDoc;
