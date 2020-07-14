import customersRoute from './customersRoute';

const apiPrefix = '/api/v1';

const routes = (app) => {
    app.get(['/', apiPrefix], (_, response) => {
        response.status(200).json({
            success: true,
            message: "Welcome to the WBankApi"
        });
    });

    // create the error object in the request object
    app.all('*', (request, response, next) => {
        request.errors = {};
        next();
    });

    app.use(apiPrefix, customersRoute);

    // Error Handler
    app.use((error, request, response, next) => response.status(error.status || 500)
        .json({ message: error.message || 'Error' }));

    // catch all routers
    app.use('*', (_, response) => response.status(404).json({
        success: false,
        error: "The route requested does not exist"
    }));

    return app;
};

export default routes;