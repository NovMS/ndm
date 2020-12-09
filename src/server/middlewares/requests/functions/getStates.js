const getStates = async (req, res) => {

  const { queryPg } = require('./../../../services/pg');

  const id = req.query.id;
  const q = `
    SELECT feed, state
    FROM userdata.ndm_state
    WHERE hash = ${id}
  `;
  const rows = await queryPg(res, q);

  const state = {
    inWork: false,
    exotic: false,
    info: false,
    accept: false,
    audience: false,
    analog: false,
    polit: false,
    other: false
  };
  let states = {
    jur: {...state},
    budget: {...state},
    buh: {...state},
    hr: {...state},
    zakupki: {...state},
    med: {...state}
  }
  rows.map((row) => {
    states[row.feed][row.state] = true;
  })
  
  return states;
  
}

module.exports = getStates;
