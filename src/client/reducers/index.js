import updateFilters from './filters';
import updateDocs from './docs';
import updateSettings from './settings';
import updateMarkup from './markup';

const reducer = (state, action) => {
  return {
    filters: updateFilters(state, action),
    docs: updateDocs(state, action),
    settings: updateSettings(state, action),
    markup: updateMarkup(state, action)
  };
};

export default reducer;
