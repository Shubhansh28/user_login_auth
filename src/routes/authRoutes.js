const express = require('express')
const authController = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/authenticate')
const { authRateLimit,validateAuthRequest } = require('../middleware/apiGuard');

const router = express.Router()

router.post('/signup',authRateLimit,validateAuthRequest, authController.signup)
router.post('/login',authRateLimit,validateAuthRequest, authController.login)
router.post('/logout', authController.logout)
router.get('/me', authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    })
})

module.exports = router