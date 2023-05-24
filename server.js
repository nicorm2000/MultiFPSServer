const clientRouter = require('./routers/clientRouter');
const serverRouter = require('./routers/serverBuildRouter');

const appForClients = require('./loaders/express');
const appForServerBuilds = require('./loaders/express');

//setup server app that will listen for our server builds messages that run on the same machine as this app
appForServerBuilds.listen(config.get('server.serverAppPort'), `localhost`);
appForServerBuilds.use('/multiFPS/s', serverRouter);


//setup server app that will listen for our clients request (they can request server list, or ask to create a game session)
appForClients.use('/multiFPS/c', clientRouter);
appForClients.listen(config.get('server.port'), config.get('server.host'));
console.log(`Started game server for clients on: ${config.get('server.host')}:${config.get('server.port')}`)
