//sbl for server build launcher
const config = require('config')

var exec = require('child_process').execFile;
        
runServerBuild = function(buildPort, userPreferences){

   var parameters = [`server ${buildPort} ${JSON.stringify(userPreferences.body)}`, `setupWebRequests localhost:${config.get('server.serverAppPort')}/multiFPS/s`];
   exec(`./build/${config.get('server.executableName')}`, parameters, {maxBuffer: 1024 * 500}, function(err, data) {
         if(err) throw err;            
   });  

   console.log(`Launched server instance on port: ${buildPort}`);      
}

module.exports = {
   runServerBuild,
}