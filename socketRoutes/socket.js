/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-console */

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(socket.id);
        require('./auth.routes')(socket);
        require('./message.routes')(socket);
        require('./game.routes')(socket);
    });

    io.engine.on('connection_error', (err) => {
        console.log('REQUEST: ', err.req);
        console.log('CODE: ', err.code);
        console.log('MESSAGE: ', err.message);
        console.log('CONTEXT: ', err.context);
    });
};
