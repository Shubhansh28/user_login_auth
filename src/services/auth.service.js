const bcrypt = require('bcrypt')
const userService = require('./user.service')
const { generateToken } = require('../auth/token')

const loginUser = async (username, password) => {
    const user = await userService.findUser(username)

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials')
    }

    const safeUser = {
        id: user.id,
        username: user.username
    }

    const token = generateToken(safeUser)

    return {
        user: safeUser,
        token
    }
}

module.exports = {
    loginUser
}
