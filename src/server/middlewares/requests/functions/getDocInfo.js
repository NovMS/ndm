const getDocInfo = async(req, res) => {

  const { queryPg } = require('./../../../services/pg');

  const id = req.query.id;

  const q = `
    SELECT title, source, docs.url, publicated_at, indexed_at, comment, docs.hash as id, array_agg(feed) as feed, array_agg(state) as state, id_ais, indexed_at
    FROM ndm.docs
    LEFT JOIN userdata.ndm_comment on docs.hash = ndm_comment.doc_hash
    LEFT JOIN userdata.ndm_state on docs.hash = ndm_state.hash
    WHERE docs.hash = ${id}
    GROUP BY id, comment
  `;

  let row = await queryPg(res, q);
  if (row.length > 0) {
    row = row[0];
    row.states = []
    if (row.feed.length>0 && row.feed[0]) {
      row.feed.map((feed, i) => {
        row.states = [
          ...row.states,
          [feed, row.state[i]]
        ]
      })
    }
  } else {
    if (isFunc) {
      return({error: 'Документ не найден'})
    } else {
      res.send({error: 'Документ не найден'});
    }
  }
  
  return(row);

}

module.exports = getDocInfo;
