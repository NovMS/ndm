module.exports = function setup(app) {
  app.use((req, res, next) => {
    let originalUrl = decodeURI(req.originalUrl);
    let reqLogin = req.query.login ? decodeURI(req.query.login) : null;

    if (originalUrl.indexOf('getParamsBeforeRedirect') != -1) {
      reqLogin = originalUrl.slice(originalUrl.indexOf('?login') + '?login'.length);
      originalUrl = originalUrl.slice(0, originalUrl.indexOf('?login'));
      let objGetParams = JSON.parse(originalUrl.slice(originalUrl.indexOf('getParamsBeforeRedirect=') + 'getParamsBeforeRedirect='.length))
      let strGetParams = '';
      for (let param in objGetParams) {
        (strGetParams != '') ? strGetParams += '&' : strGetParams += '?';
        strGetParams += `${param}=${encodeURIComponent(objGetParams[param])}`;
      }
      originalUrl = `${req.baseUrl}${req.path}${strGetParams}`;
    }

    if (/.css|.js|.jpg|.jpeg|.ico|.png|woff2/gi.test(req.path)) {
      next();
    } else {
      if (reqLogin) {
        const login = reqLogin.split('\\')[1] || reqLogin;
        res.cookie('login', login, {expires: new Date(Date.now() + 8 * 3600000)})
        res.append('Cache-Control', 'no-store');
        res.redirect(302, (originalUrl.replace(`?login=${reqLogin}`, '').replace(`&login=${reqLogin}`, '')));
      } else {
        if (req.cookies.login) {
          next();
        } else {
          res.redirect(302, `http://triada.consultant.ru/AuthRedirectService/?callback=${req.protocol}://${req.headers['last-host']}${req.baseUrl}${req.path}?getParamsBeforeRedirect=${JSON.stringify(req.query)}`);
        }
      }
    }
  });
};
