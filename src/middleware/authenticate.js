const { AUTH_COOKIE_NAME, verifyToken } = require('../auth/token')

const authenticate = (req, res, next) => {
    const token = req.cookies?.[AUTH_COOKIE_NAME]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied.'
        })
    }

    try {
        req.user = verifyToken(token)
        next()
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? 'Token expired.'
            : 'Invalid token.'

        return res.status(403).json({
            success: false,
            message
        })
    }
}

module.exports = {
    authenticate
}
