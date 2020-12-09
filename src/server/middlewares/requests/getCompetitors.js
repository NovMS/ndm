const getCompetitors = async(req, res) => {
  const { queryPg } = require('./../../services/pg');

  const getSomeGroup = async(name) => {
    let getSources = `
      SELECT *
      FROM ndm.competitors
      WHERE group_name = '${name}'
    `;
    let sources = await queryPg(res, getSources);
    let source = {};
    sources.map((item) => {
      source[item.key] = item.name
    });
    return source;
  };

  let result = [];

  const getGroups = `
    SELECT group_name
    FROM ndm.competitors
    WHERE group_name != 'test' and group_name != 'other'
    GROUP BY group_name
  `;
  const groups = await queryPg(res, getGroups);

  for (let i = 0; i < groups.length; i++) {
    result.push(await getSomeGroup(groups[i].group_name));
  }

  result.push(await getSomeGroup('other'));

  if ((req.cookies.login == 'admin') || (req.cookies.login == 'SUBD-NovoseltsevMS')) {
    result.push(await getSomeGroup('test'));
  }

  res.send(result);
}

module.exports = getCompetitors;
