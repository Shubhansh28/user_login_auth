const {prisma} = require('../config/config')

const createUser = async(info) => {
    const user = await prisma.user.create({
        data: info
    })
    return user
}

const findUserByUsername = async(data) => {
    const user = await prisma.user.findUnique({
        where: {
            username: data
        }
    })
    return user
}

const findUserById = async(userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    return user
}

const updateUserRole = async(userId,role) => {
    const updatedUser = await prisma.user.updateMany({
        where: {
            id: userId
        },
        data: {role}
    })
    return updatedUser
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
    updateUserRole
}