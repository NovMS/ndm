module.exports = function setup(app) {
  app.use((req, res, next) => {
    const moment = require('moment');
    moment.locale('ru');

    // if((req.path == '/ping') || req.query.ping){
    //   next();
    //   console.log('ping');
    // }
    // if(!req.cookies.login || (req.cookies.login == 'admin')){
    //   next();
    //   console.log('login');
    // }
    //
    // const domain = req.get('Last-Host'),
    //       service = domain.split('\\.')[0].split('-', 2)[1].replace("-", "_"),
    //       month = moment().format('YYYYMM');
    // let failDetails = null,
    //     failHash = null;


    next();
  });
};
