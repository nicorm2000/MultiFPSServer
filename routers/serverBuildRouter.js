const router = require('express').Router()
const services = require('../services/roomListServices')

//server endpoints
router.post('/deleteRoom', services.deleteRoom)
router.post('/gameBooted', services.onGameServed)
router.post('/gameUpdate', services.updateRoom)

module.exports = router

