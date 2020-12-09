const docInfoChanged = (newValues) => {
  return {
    type: 'DOCINFO_CHANGED',
    payload: newValues
  };
};

const similarDocsChanged = (newValues) => {
  return {
    type: 'SIMILARDOCS_CHANGED',
    payload: newValues
  };
};

const statesChanged = (newValues) => {
  return {
    type: 'STATES_CHANGED',
    payload: newValues
  };
};

const relativeDocsChanged = (newValues) => {
  return {
    type: 'RELATIVESDOCS_CHANGED',
    payload: newValues
  };
};

const doublesDocsChanged = (newValues) => {
  return {
    type: 'DOUBLESDOCS_CHANGED',
    payload: newValues
  };
};

const relativeDocsListChanged = (newValues) => {
  return {
    type: 'RELATIVESDOCSLIST_CHANGED',
    payload: newValues
  };
};

const doublesDocsListChanged = (newValues) => {
  return {
    type: 'DOUBLESDOCSLIST_CHANGED',
    payload: newValues
  };
};

export {
  docInfoChanged,
  similarDocsChanged,
  statesChanged,
  relativeDocsChanged,
  doublesDocsChanged,
  relativeDocsListChanged,
  doublesDocsListChanged
}

