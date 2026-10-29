const bcrypt = require('bcrypt')
const userService = require('../services/user.service')
const authService = require('../services/auth.service')

const saltRounds = 10

const isValidCredentials = (username, password) =>
    typeof username === 'string' &&
    typeof password === 'string' &&
    username.trim() !== '' &&
    password.trim() !== ''

const publicUser = ({ id, username, dateCreated, updatedAt }) => ({
    id,
    username,
    dateCreated,
    updatedAt
})

const signup = async (req, res) => {
    const { username, password } = req.body

    if (!isValidCredentials(username, password)) {
        return res.status(400).json({ message: 'invalid username or password' })
    }

    try {
        const existingUser = await userService.findUser(username)
        if (existingUser) {
            return res.status(409).json({ message: 'user already exist' })
        }

        const hashedPassword = await bcrypt.hash(password.trim(), saltRounds)
        const user = await userService.createUser({
            username: username.trim(),
            password: hashedPassword
        })

        return res.status(201).json(publicUser(user))
    } catch (error) {
        return res.status(500).json({ message: 'server error' })
    }
}

const login = async (req, res) => {
    const { username, password } = req.body

    if (!isValidCredentials(username, password)) {
        return res.status(400).json({
            success: false,
            message: 'invalid username or password'
        })
    }

    try {
        const { user, token } = await authService.loginUser(
            username.trim(),
            password.trim()
        )

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user
        })
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({
                success: false,
                message: error.message
            })
        }

        return res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}

module.exports = {
    signup,
    login
}