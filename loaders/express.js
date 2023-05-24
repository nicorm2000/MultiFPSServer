//server application for reading unity web request

const express = require('express')
const config = require("config")

const bp = require('body-parser'); //for reading unity web requests
const cors = require('cors'); //for not blocking unity web requests

const app = express()

app.use(cors());
app.options('*', cors());

// Allows us to parse whole json trough URL. Without it app can't read request body.
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

module.exports = app