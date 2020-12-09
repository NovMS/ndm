const settingsChanged = (newValues) => {
  return {
    type: 'SETTINGS_CHANGED',
    payload: newValues
  };
};

export {
  settingsChanged
}

