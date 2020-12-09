const defaultState = () => {
  return {
    sources: null,
    feeds: null,
    competitors: null
  };
};

const updateSettings = (state, action) => {

  if (state === undefined) {
    return defaultState();
  }
  switch (action.type) {

    case 'SETTINGS_CHANGED':
      return {
        ...state.settings,
        ...action.payload
      };

    default:
      return state.settings;
  }
};

export default updateSettings;
