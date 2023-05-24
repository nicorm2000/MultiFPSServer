const router = require('express').Router()
const services = require('../services/roomListServices')

//client endpoints
router.get('/serverList', services.getAllRooms)
router.post('/createGame', services.addRoomByClient)
router.get('/regionCheck', (req, res) =>{ res.sendStatus(202); }); //just send status 202 so game client will acknowledge entry connection to this server 

module.exports = router

