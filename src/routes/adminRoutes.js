const express = require('express')
const { authenticate } = require('../middleware/authenticate')
const adminAuth = require('../middleware/adminOnly')
const adminController = require('../controllers/admin.controller')
const router = express.Router()

router.get('/users/overview',authenticate,adminAuth,adminController.getUserOverview)
router.get('/users/:userId/history',authenticate,adminAuth,adminController.getUserHistory)
router.patch('/users/:userId/role',authenticate,adminAuth,adminController.roleChange)

module.exports = router