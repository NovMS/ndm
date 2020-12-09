module.exports = function setup(app) {
  app.post('/api/getLastDocs', require('./requests/getLastDocs'));
  app.post('/api/setUserFilters', require('./requests/setUserFilters'));
  app.post('/api/getSimilarDocs',  require('./requests/getSimilarDocs'));
  app.post('/api/sendComment', require('./requests/sendComment'));
  app.post('/api/setStates', require('./requests/setStates'));
  app.post('/api/delRelative', require('./requests/delRelative'));
  app.post('/api/addAis', require('./requests/addAis'));
  app.post('/api/setSkip', require('./requests/setSkip'));
  app.post('/api/setInWorkState', require('./requests/setInWorkState'));

  app.get('/api/getUserFilters', require('./requests/getUserFilters'));
  app.get('/api/getNextDoc', require('./requests/getNextDoc'));
  app.get('/api/getRelatedDocs', require('./requests/getRelatedDocs'));
  app.get('/api/getSources', require('./requests/getSources'));
  app.get('/api/getDocAisInfo', require('./requests/getDocAisInfo'));
  app.get('/api/getDoublesId', require('./requests/getDoublesId'));
  app.get('/api/getStatus', require('./requests/getStatus'));
  app.get('/api/getCompetitors', require('./requests/getCompetitors'));
  app.get('/api/resetFilters', require('./requests/resetFilters'));

  app.get('/api/getDocInfo', async (req, res) => {
    res.send(await require('./requests/functions/getDocInfo')(req, res));
  });
  app.get('/api/getStates', async (req, res) => {
    res.send(await require('./requests/functions/getStates')(req, res));
  });
  app.get('/api/getRelativesId', async (req, res) => {
    res.send(await require('./requests/functions/getRelativesId')(req, res));
  });
  app.post('/api/setRelative', async (req, res) => {
    res.send(await require('./requests/functions/setRelative')(req, res));
  });
};
