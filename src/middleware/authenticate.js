const { AUTH_COOKIE_NAME, verifyToken } = require('../auth/token')
const { findUserById } = require('../services/user.service')

const authenticate = async(req, res, next) => {
    const token = req.cookies?.[AUTH_COOKIE_NAME]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied.'
        })
    }

    try {
        req.user = verifyToken(token)
        const user = await findUserById(req.user.id)
        if (!user){
            return res.status(404).json({success: false, message: "User does Not exist"})
        }
        req.user.role = user.role
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
    authenticate,
}
