const express = require('express')
const authController = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/authenticate')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/me', authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    })
})

module.exports = router