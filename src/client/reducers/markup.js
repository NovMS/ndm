const defaultState = () => {
  return {
    docInfo: null,
    similarDocs: null,
    states: {},
    relativesDocs: [],
    doublesDocs: [],
    relativesDocsList: null,
    doublesDocsList: null
  };
};

const updateMarkup = (state, action) => {

  if (state === undefined) {
    return defaultState();
  }
  switch (action.type) {

    case 'DOCINFO_CHANGED':
      return {
        ...state.markup,
        docInfo: action.payload
      };

    case 'SIMILARDOCS_CHANGED':
      return {
        ...state.markup,
        similarDocs: action.payload
      };

    case 'STATES_CHANGED':
      return {
        ...state.markup,
        states: action.payload
      };
  
    case 'RELATIVESDOCS_CHANGED':
      return {
        ...state.markup,
        relativesDocs: action.payload
      };

    case 'DOUBLESDOCS_CHANGED':
      return {
        ...state.markup,
        doublesDocs: action.payload
      };
      
    case 'RELATIVESDOCSLIST_CHANGED':
      return {
        ...state.markup,
        relativesDocsList: action.payload
      };

    case 'DOUBLESDOCSLIST_CHANGED':
      return {
        ...state.markup,
        doublesDocsList: action.payload
      };
  
    default:
      return state.markup;
  }
};

export default updateMarkup;
