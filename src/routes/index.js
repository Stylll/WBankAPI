import customersRoute from './customersRoute';
import accountsRoute from './accountsRoute';

const apiPrefix = '/api/v1';

const routes = (app) => {
    app.get(['/', apiPrefix], (_, response) => {
        response.status(200).json({
            success: true,
            message: "Welcome to the WBankApi"
        });
    });

    app.all('*', (request, response, next) => {
        // create error object in request
        request.errors = {};
        // clean request body values
        const body = {};
        Object.keys(request.body).forEach((key) => {
            body[key] = `${request.body[key]}`
        });
        request.body = body;
        next();
    });

    app.use(apiPrefix, customersRoute);
    app.use(apiPrefix, accountsRoute);

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