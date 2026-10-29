const {prisma} = require('../config/config')

const createUser = async(info) => {
    const user = await prisma.user.create({
        data: info
    })
    return user
}

const findUser = async(data) => {
    const user = await prisma.user.findUnique({
        where: {
            username: data
        }
    })
    return user
}

module.exports = {
    createUser,
    findUser
}