module.exports.sourceTransform = async (res, source) => {
  if (source == 'ais') return 'АИС';

  const { queryPg } = require('./pg');
  let result;

  let sources = await queryPg(res, `
    SELECT *
    FROM ndm.sources
  `);
  sources.map((item) => {
    if (item.key == source) {
      result = item.name;
    }
  });

  if (result) {
    return result;
  } else {
    let competitors = await queryPg(res, `
      SELECT *
      FROM ndm.competitors
    `);
    competitors.map((item) => {
      if (item.key == source) {
        result = item.name;
      }
    });
    return result;
  }
  
}

module.exports.lentaTransform = (lenta) => {
  switch (lenta) {
    case 'jur': return('Для юриста'); break;
    case 'buh': return('Для бухгалтера'); break;
    case 'hr': return('Для кадровика'); break;
    case 'zakupki': return('Для специалиста по госзаказу'); break;
    case 'med': return('Для мед. организаций'); break;
    case 'budget': return('Для бюджетника'); break;
    case 'Для юриста': return('jur'); break;
    case 'Для бухгалтера': return('buh'); break;
    case 'Для кадровика': return('hr'); break;
    case 'Для специалиста по госзаказу': return('zakupki'); break;
    case 'Для мед. организаций': return('med'); break;
    case 'Для бюджетника': return('budget'); break;
    default: return('');
  }
}
