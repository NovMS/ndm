const getRelatedDocs = async (req, res) => {

  const { queryPg } = require('./../../services/pg');
  const getRelativesId = require('./functions/getRelativesId');

  const id = req.query.id;

  const relId = await getRelativesId({query: {id: id}}, res)

  const q = `
    SELECT title, source, docs.url, publicated_at, comment, docs.hash as id, array_agg(feed) as feed, array_agg(state) as state, id_ais, indexed_at
    FROM ndm.docs
    LEFT JOIN userdata.ndm_comment on docs.hash = ndm_comment.doc_hash
    LEFT JOIN userdata.ndm_state on docs.hash = ndm_state.hash
    WHERE (docs.hash = ANY ('{${relId.toString()}}'))
    GROUP BY id, comment
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
  res.send(rows);
}

module.exports = getRelatedDocs;
