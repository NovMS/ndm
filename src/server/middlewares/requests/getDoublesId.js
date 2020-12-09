const getDoublesId = async (req, res) => {

  const { queryPg } = require('./../../services/pg');
  const {id} = req.query;

  const qDouble = `
    SELECT * FROM userdata.ndm_double
    WHERE (hash_doc = ${id} OR hash_double = ${id})
  `;
  const double = await queryPg(res, qDouble);
  let setDouble = new Set();

  for (let i = 0; i < double.length; i++) {
    if (double[i].hash_doc != id) {
      setDouble.add(double[i].hash_doc);
    }
    if (double[i].hash_double != id) {
      setDouble.add(double[i].hash_double);
    }
  }

  res.send([...setDouble]);
}

module.exports = getDoublesId;
