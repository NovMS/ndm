const getRelativesId = async (req, res) => {

  const { queryPg } = require('./../../../services/pg');
  const {id} = req.query;

  const qRel = `
    SELECT * FROM userdata.ndm_relatives
    WHERE (hash_doc = ${id} OR hash_rel_doc = ${id})
  `;
  const rel = await queryPg(res, qRel);
  let setRel = new Set();

  for (let i = 0; i < rel.length; i++) {
    if (rel[i].hash_doc != id) {
      setRel.add(rel[i].hash_doc);
    }
    if (rel[i].hash_rel_doc != id) {
      setRel.add(rel[i].hash_rel_doc);
    }
  }

  return([...setRel]);
}

module.exports = getRelativesId;
