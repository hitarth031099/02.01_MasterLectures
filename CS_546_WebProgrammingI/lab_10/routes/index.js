const loginRoutes = require('./login');
const privateRoutes = require('./private');
const signupRoutes = require('./signup');

const constructorMethod = (app) => {

  app.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  app.use('/login', loginRoutes);
  app.use('/private', privateRoutes);
  app.use('/signup', signupRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not found' });
  });
};

module.exports = constructorMethod;
