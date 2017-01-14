'use strict';

const endpoints = require('./endpoints');

const PORT = process.env.PORT || 8081;

const server = endpoints.listen(process.env.PORT || 8081, function() {
    endpoints.init();
    console.log('Server started in the port: ', process.env.PORT || 8081);
});