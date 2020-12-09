const defaultState = () => {
  const url_string = window.location.href;
  const url = new URL(url_string);
  return {
    searchValue: url.searchParams.get('searchValue') || '',
    dateFrom: url.searchParams.get('dateFrom') || '',
    dateTo: url.searchParams.get('dateTo') || '',
    status: url.searchParams.get('status') || 'all'
  };
};

const updateFilters = (state, action) => {

  if (state === undefined) {
    return defaultState();
  }
  switch (action.type) {

    case 'FILTERS_CHANGED':
      return {
        ...state.filters,
        ...action.payload
      };

    case 'FILTERS_RESET':
      return {...state.filters,
              searchValue: '',
              dateFrom: '',
              dateTo: '',
              status: 'all'};

    default:
      return state.filters;
  }
};

export default updateFilters;
