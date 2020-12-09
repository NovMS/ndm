const feeds = [{
  'jur': 'Юрист',
  'budget': 'Бюджетник',
  'buh': 'Бухгалтер',
  'hr': 'Кадровик',
  'zakupki': 'Спец. по госзакупкам',
  'med': 'Мед. организация'
}];

const sources = [{
  council: 'Заседания Совета Федерации',
  regulation: 'regulation.gov.ru',
  fns_news: 'ФНС (новости)',
  fns_npa: 'ФНС (нормативные правовые акты)',
  fns_pp: 'ФНС (обзоры судов)',
  fns_sp: 'ФНС (сведения о судебных постановлениях)',
  fns_sr: 'ФНС (иные судебные решения)'    
},{
  gd_pp: 'ГД (проекты постановлений)',
  gd_pz: 'ГД (проекты законодательных инициатив)',
  gd_table: 'ГД (результаты рассмотрения законопроектов, законов и проектов постановлений)',
  gd_z: 'ГД (законопроекты)'
},{
  kplus_law: 'К+ LAW',
  kplus_mlaw: 'К+ MLAW',
  kplus_arb: 'К+ ARB',
  kplus_rgss: 'К+ RGSS',
  kplus_quest: 'К+ QUEST',
  kplus_qsbo: 'К+ QSBO',
  kplus_med: 'К+ MED',
  kplus_prj: 'К+ PRJ',
  kplus_pnpa: 'К+ PNPA'
},{
  nfd_publication: 'pravo.gov.ru',
  nfd_rosmintrud: 'Минтруд',
  nfd_rostrud: 'Роструд'
},{
  nfd_ksrf: 'КС РФ',
  nfd_minfin: 'Минфин',
  nfd_roskazna: 'Казначейство',
  nfd_vsrf: 'ВС РФ'
}];

export {
  feeds, sources
}