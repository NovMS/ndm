const getSources = async(req, res) => {
  const { queryPg } = require('./../../services/pg');

  const getSomeGroup = async(name) => {
    let getSources = `
      SELECT *
      FROM ndm.sources
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
    FROM ndm.sources
    WHERE group_name != 'test' and group_name != 'other' and group_name != 'gd'
    GROUP BY group_name
  `;
  const groups = await queryPg(res, getGroups);
  result.push(await getSomeGroup('other'));
  result.push(await getSomeGroup('gd'));

  for (let i = 0; i < groups.length; i++) {
    result.push(await getSomeGroup(groups[i].group_name));
  }

  if ((req.cookies.login == 'admin') || (req.cookies.login == 'SUBD-NovoseltsevMS')) {
    result.push(await getSomeGroup('test'));
  }

  res.send(result);
}

module.exports = getSources;
