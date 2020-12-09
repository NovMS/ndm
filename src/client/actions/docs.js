const docsLoaded = (newValue) => {
  return {
    type: 'FETCH_DOCS_SUCCESS',
    payload: newValue
  };
};

const docsLoading = () => {
  return {
    type: 'FETCH_DOCS_REQUEST'
  };
};

const docsLoadingChange = (value) => {
  return {
    type: 'DOCS_LOADING',
    value
  };
};

const newDocsLoaded = (newDocs) => {
  return {
    type: 'FETCH_NEW_DOCS_SUCCESS',
    payload: newDocs
  };
};

export {
  docsLoaded,
  docsLoading,
  newDocsLoaded,
  docsLoadingChange
}

