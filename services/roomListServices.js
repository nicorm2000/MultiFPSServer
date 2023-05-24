const sbl = require('../sbl')

config = require('config')

var fp = require("find-free-port")

waitingClientsList = [];
clientsReqestsList = [];

currentRunningServerBuildsAmount = 0;
maxServerBuildAmount = 2;

let roomList = [];

getAllRooms = async (req, res) => {
    res.status(202).send(roomList)
}

updateRoom = async (req, res) => {
    try {
        if(!req.body.Port){  
            console.log("port not found in request?");
            return res.sendStatus(400)
        }

        room = findRoomByPort(req.body.Port);

        room.ServerName = req.body.ServerName || room.ServerName
        room.GamemodeID = req.body.GamemodeID || room.GamemodeID
        room.MapID = req.body.MapID || room.MapID
        room.MaxPlayers = req.body.MaxPlayers || room.MaxPlayers
        room.CurrentPlayers = req.body.CurrentPlayers || room.CurrentPlayers

        res.sendStatus(202);

        console.log(`Updating game on port: ${req.body.Port}. Connected players: ${room.CurrentPlayers}`);

    } catch(err) {
        res.sendStatus(500)
        console.log(err) 
    }
}

currentlyBootingServerBuild = false;

addRoomByClient = async (req, res) => {

    if(currentRunningServerBuildsAmount>= maxServerBuildAmount) {
        console.log("Reached maximum running builds at a time");

        var connectDataForClient = 
        {
            "Address": "X",
            "Port": "",
        }

        res.status(202).send(connectDataForClient)
        return
    }

    currentRunningServerBuildsAmount++;

    //first check if client does not already reqested room creation
    if(clientsReqestsList.find(o => o.clientRes.ip == req.ip) || waitingClientsList.find(o => o.res.ip == req.ip))
        return console.log("Same client requests creating room multiple times")
    
    clientsReqestsList.unshift({
        clientReq: req,
        clientRes: res,
    })

    console.log("Registered game reqest from client on: "+req.ip);
    
    if(!currentlyBootingServerBuild) bootServerBuild();
}

bootGameIfAnotherNeeded = () =>
{
    currentlyBootingServerBuild = false;

    if(clientsReqestsList.length == 0) return;

    bootServerBuild();
}


bootServerBuild = () => {
    
    currentlyBootingServerBuild = true;

    client = clientsReqestsList[0];

    clientsReqestsList.splice(clientsReqestsList.indexOf(client), 1);

    console.log(`Delivering game for client on: ${client.clientReq.ip}, currently running builds: ${currentRunningServerBuildsAmount}`)

    var freePort;
        
    fp(config.get('server.port')+1).then(([freep]) => {
        
        freePort = freep;

        //add client to queue that needs to be informed that his game is setup so he can connect to it
        waitingClientsList.unshift( {
            port: freePort,
            res: client.clientRes,
        })

        sbl.runServerBuild(freePort, client.clientReq)

        if(findRoomByPort(freePort))
            deleteRoomByPort(freePort)
        
        let roomE = {};

        roomE.Port = freePort;
        roomE.ServerAddress = config.get('server.host');

        roomE.ServerName = client.clientReq.body.ServerName || "Room";
        roomE.GamemodeID = 0;
        roomE.MapID = client.clientReq.body.MapID;
        roomE.MaxPlayers = client.clientReq.body.MaxPlayers;
        roomE.CurrentPlayers = 0;

        roomList.push(roomE);
    })
}


onGameServed = async (req, res) => {

    obj = waitingClientsList.find(o => o.port == req.body.Port);

    if(!obj) {
        console.log("lost client who created room");
        return  res.sendStatus(404);
    }

    waitingClientsList.splice(waitingClientsList.indexOf(obj), 1);

    var connectDataForClient = 
    {
        "Address": config.get('server.host'),
        "Port": req.body.Port,
    }

    obj.res.status(202).send(connectDataForClient); //for client

    res.sendStatus(202); //for unity build, just to close connection

    bootGameIfAnotherNeeded();
}


deleteRoom = async (req, res) => {
    try {
        if(!req.body.Port)  return res.sendStatus(403)

        currentRunningServerBuildsAmount--;

        deleteRoomByPort(req.body.Port);
        
        res.sendStatus(202);

        console.log(`Deleted game on port: ${req.body.Port}`);

    } catch(err) {
        res.sendStatus(500)
        console.log(err) 
    }
}

function deleteRoomByPort (portToDelete)  {    
    roomList.splice(roomList.indexOf(findRoomByPort(portToDelete)), 1);
}

function findRoomByPort (port)
{
    //let room = (roomList.find(obj => {return obj.Port === port}));
    for (var i=0; i < roomList.length; i++) {
        o = roomList[i];
    
        if(o.Port == port) return o;
    }
    return null;
}

module.exports = {
    onGameServed,
    addRoomByClient,
    getAllRooms,
    deleteRoom,
    updateRoom,
}