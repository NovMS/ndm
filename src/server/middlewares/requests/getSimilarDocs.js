const getSimilarDocs = async (req, res) => {

  const { axiosGet } = require('./../../services/axios');
  const { queryPg } = require('./../../services/pg');
  const { getQuery } = require('./request-services/getQuery');
  const { getExtensionText } = require('./request-services/getExtensionText');
  const getRelativesId = require('./functions/getRelativesId');
  const getDocInfo = require('./functions/getDocInfo');

  const title = req.body.title;
  const id = req.body.id;
  const isAis = req.body.isAis || false;

  const textStemm = await axiosGet(res, `http://10.106.78.205:80/windows-services/getRussianStemm?query=${encodeURI(title).replace(/\&/gi, '')}`);
  const extensionWords = await axiosGet(res, `http://10.106.78.205:80/windows-services/getQueryExtensionWords?query=${encodeURI(title).replace(/\&/gi, '')}`);
  const query = getQuery(textStemm);

  const q = `
    SELECT title, source, docs.url, publicated_at, comment, docs.hash as id, array_agg(feed) as feed, array_agg(state) as state,
      ts_rank_cd(title_stemm_index, query) / (1 + log(1 + length(title_stemm_index))) as rel,
      exists(select 1 from userdata.ndm_relatives where ((hash_doc = docs.hash and hash_rel_doc = ${id}) or (hash_doc = ${id} and hash_rel_doc = docs.hash))) as is_rel, id_ais, indexed_at
    FROM ndm.docs
    LEFT JOIN userdata.ndm_comment on docs.hash = ndm_comment.doc_hash
    LEFT JOIN userdata.ndm_state on docs.hash = ndm_state.hash,
    to_tsquery('${query}') query
    WHERE docs.hash != ${id} 
    AND id_ais is ${!isAis ? 'not' : ''} null
    AND docs.filter
    GROUP BY id, comment, query
    order by rel desc, indexed_at desc
    limit 20
  `;
  const rows = await queryPg(res, q);

  let relId = await getRelativesId({query: {id: id}}, res);

  for (let i = 0; i < rows.length; i++) {
    rows[i].states = [];
    if (rows[i].feed.length>0 && rows[i].feed[0]) {
      rows[i].feed.map((feed, j) => {
        rows[i].states = [
          ...rows[i].states,
          [feed, rows[i].state[j]]
        ]
      })
    }
    rows[i].title = getExtensionText(rows[i].title, extensionWords);
    relId = relId.filter(relItem => relItem != rows[i].id);
  }

  let relDocs = [];
  for (let i = 0; i < relId.length; i++) {
    let relDoc = await getDocInfo({query: {id: relId[i]}}, res);
    relDocs.push(relDoc);
  }  
  res.send([...relDocs, ...rows]);
}

module.exports = getSimilarDocs;
