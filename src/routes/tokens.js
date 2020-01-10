const express = require('express')
const router = express.Router()
const { add } = require('../modules/tokens')




router.post('/', add)


module.exports = router
