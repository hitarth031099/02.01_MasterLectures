const searchRoutes = require('./search');
const charactersRoutes = require('./characters');
const path = require("path");

const constructorMethod = (app) => {
  app.use('/search', searchRoutes);
  app.use('/characters', charactersRoutes);

  app.get('/', (req, res) => {
    res.render("search/finder", { "title": "Character Finder" });
  });

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not found' });
  });
};

module.exports = constructorMethod;
