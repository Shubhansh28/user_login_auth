const express = require('express')
const { authenticate } = require('../middleware/authenticate')
const adminAuth = require('../middleware/adminOnly')
const adminController = require('../controllers/admin.controller')
const router = express.Router()

router.patch('/users/:userId/role',authenticate,adminAuth,adminController.roleChange)

module.exports = router