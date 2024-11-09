const express = require('express')
const router = express.Router()
const {matchDoctor} = require("./appointmentController")

router.post("/", matchDoctor)

module.exports = router