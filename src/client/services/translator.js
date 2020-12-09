const statesTransform = (state) => {
  switch (state) {
    case 'inWork': return('В работу'); break;
    case 'exotic': return('Брак (ниже экзотики 0)'); break;
    case 'info': return('Брак (нет инфоповода)'); break;
    case 'accept': return('Брак (вряд ли примут)'); break;
    case 'audience': return('Брак (не аудит. ленты)'); break;
    case 'analog': return('Брак (аналог)'); break;
    case 'polit': return('Брак (политика)'); break;
    case 'other': return('Брак (другое)'); break;
    case 'skip': return('Пропущен'); break;
    default: return('');
  }
}

const feedsTransform = (feed) => {
  switch (feed) {
    case 'jur': return('Юрист'); break;
    case 'budget': return('Бюджетник'); break;
    case 'buh': return('Бухгалтер'); break;
    case 'hr': return('Кадровик'); break;
    case 'zakupki': return('Спец. по госзакупкам'); break;
    case 'med': return('Мед. организация'); break;
    case 'Юрист': return('jur'); break;
    case 'Бюджетник': return('budget'); break;
    case 'Бухгалтер': return('buh'); break;
    case 'Кадровик': return('hr'); break;
    case 'Спец. по госзакупкам': return('zakupki'); break;
    case 'Мед. организация': return('med'); break;
    default: return('');
  }
}

const statusTransform = (status) => {
  switch (status) {
    case 'Все документы': return('all'); break;
    case 'Моя разметка': return('my'); break;
    case 'Только с разметкой': return('withMarkup'); break;
    case 'Без разметки': return('withoutMarkup'); break;
    case 'Без разметки в моих лентах': return('withoutMarkupLents'); break;
    case 'Взят в работу': return('inWork'); break;
    default: return('all');
  }
}

export {
  statesTransform,
  feedsTransform,
  statusTransform
}
