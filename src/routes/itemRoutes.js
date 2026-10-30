const express = require('express')
const authController = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/authenticate')
const { getItem,createItem,patchItem } = require('../controllers/item.controller')
const router = express.Router()

router.get("/",authenticate,getItem)
router.post("/",authenticate,createItem)
router.patch("/:itemId",authenticate,patchItem)

module.exports = router