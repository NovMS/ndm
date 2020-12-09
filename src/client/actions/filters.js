const filtersChanged = (newValues) => {
  return {
    type: 'FILTERS_CHANGED',
    payload: newValues
  };
};

const filtersReset = () => {
  return {
    type: 'FILTERS_RESET'
  };
};



export {
  filtersChanged,
  filtersReset
}

