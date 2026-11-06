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
        },
        select: {
            id: true,
            username: true,
            role: true
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

const userStats = async() => {
    const [users, itemCounts] = await prisma.$transaction([
        prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                dateCreated: true,
                updatedAt: true
            }
        }),
        prisma.item.groupBy({
            by: ['userId', 'status'],
            _count: {
                _all: true
            }
        })
    ])

    const countsByUserId = new Map()

    for (const itemCount of itemCounts) {
        const counts = countsByUserId.get(itemCount.userId) || {
            totalItems: 0,
            totalOpenItems: 0,
            totalClaimedItems: 0
        }

        counts.totalItems += itemCount._count._all

        if (itemCount.status === 'open') {
            counts.totalOpenItems = itemCount._count._all
        } else if (itemCount.status === 'claimed') {
            counts.totalClaimedItems = itemCount._count._all
        }

        countsByUserId.set(itemCount.userId, counts)
    }

    return users.map(user => ({
        ...user,
        ...(countsByUserId.get(user.id) || {
            totalItems: 0,
            totalOpenItems: 0,
            totalClaimedItems: 0
        })
    }))
}

const userHistory = async(userId) => {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            username: true,
            role: true,
            dateCreated: true,
            updatedAt: true,
            items: true
        }
    })
    return user
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
    updateUserRole,
    userStats,
    userHistory
}