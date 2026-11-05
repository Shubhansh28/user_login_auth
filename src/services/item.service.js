const {prisma} = require('../config/config')

const findItem = async(itemId) => {
    const Item = await prisma.item.findUnique({
        where: {
            id: itemId
        }
    })
    return Item
}

const FetchItems = async() => {
    const items = await prisma.item.findMany({
        where: {
            status: 'open'
        },
        include: {
            user: {
                select: {
                    username: true
                }
            }
        }
    })
    return items
}

const insertIntoItem = async({name,type,place,contact,userId}) => {
    const item = await prisma.item.create({
        data: {
            name: name.trim(),
            type: type.trim(),
            place: place.trim(),
            contact: contact.trim(),
            userId
        }
    })
    return item
}

const patchIntoItem = async(itemId,userId,role,patchItem) => {
    const where = role==='admin' ? {id: itemId} : {id: itemId,userId: userId}
    const updateResult = await prisma.item.updateMany({
        where,
        data: patchItem
    })
    return updateResult
}

const patchIntoItemStatus = async(itemId,userId,role,status) => {
    const where = role==='admin' ? {id: itemId} : {id: itemId,userId: userId}
    const updateResult = await prisma.item.updateMany({
        where,
        data: {
            status
        }
    })
    return updateResult
}

const deleteFromItem = async(itemId,userId,role) => {
    const where = role==='admin' ? {id: itemId} : {id: itemId,userId: userId}
    const deleteResult = await prisma.item.deleteMany({
        where
    })
    return deleteResult
}

module.exports = {
    findItem,
    FetchItems,
    insertIntoItem,
    patchIntoItem,
    patchIntoItemStatus,
    deleteFromItem,
}