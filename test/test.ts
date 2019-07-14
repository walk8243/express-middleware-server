beforeEach(() => {
  process.env.SERVER = 'true';
});

require('./server');
require('./master');
require('./worker');
require('./app');
require('./router');
require('./middleware');
