const restaurantsRoutes = require('./restaurants');
const reviewsRoutes = require('./reviews');

const constructorMethod = (app) => {
    app.use('/restaurants', restaurantsRoutes);
    app.use('/reviews', reviewsRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Page Not found' });
    });
};

module.exports = constructorMethod;
