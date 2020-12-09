const updateDocs = (state, action) => {

  if (state === undefined) {
    return {
      docs: [],
      similarDocs: [],
      relatedDocs: [],
      doubleDocs: [],
      loadingSimilarDocs: true,
      loadingDocs: true,
      loadingRelatedDocs: true,
      loadingDoubleDocs: true,
      isMarkup: false,
      lastDocId: null
    };
  }

  switch (action.type) {

    case 'FETCH_DOCS_SUCCESS':
      return {
        ...state.docs,
        docs: action.payload,
        loadingDocs: false
      };

    case 'DOCS_LOADING':
      return {
        ...state.docs,
        loadingDocs: action.value
      };

    case 'FETCH_SIMILAR_DOCS_SUCCESS':
      return {
        ...state.docs,
        similarDocs: action.payload,
        loadingSimilarDocs: false
      };

    case 'FETCH_SIMILAR_DOCS_REQUEST':
      return {
        ...state.docs,
        similarDocs: [],
        loadingSimilarDocs: true
      };


    case 'FETCH_RELATED_DOCS_SUCCESS':
      return {
        ...state.docs,
        relatedDocs: action.payload,
        loadingRelatedDocs: false
      };

    case 'FETCH_RELATED_DOCS_REQUEST':
      return {
        ...state.docs,
        relatedDocs: [],
        loadingRelatedDocs: true
      };

    case 'FETCH_DOUBLE_DOCS_SUCCESS':
      return {
        ...state.docs,
        doubleDocs: action.payload,
        loadingDoubleDocs: false
      };

    case 'FETCH_DOUBLE_DOCS_REQUEST':
      return {
        ...state.docs,
        doubleDocs: [],
        loadingDoubleDocs: true
      };

    case 'FETCH_NEW_DOCS_SUCCESS':
      return {
        ...state.docs,
        docs: [...state.docs.docs, ...action.payload],
        loadingDocs: false
      };

    case 'FETCH_DOCS_REQUEST':
      return {
        ...state.docs,
        docs: [],
        loadingDocs: true
      };

    case 'ISMARKUP_CHANGE':
      return {
        ...state.docs,
        isMarkup: action.value
      };

    case 'LASTDOCID_CHANGE':
      return {
        ...state.docs,
        lastDocId: action.value
      };

    default:
      return state.docs;
  }
};

export default updateDocs;
