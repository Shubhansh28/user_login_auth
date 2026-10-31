const {prisma} = require('../config/config')

const validation = ({name,type,place,contact}) => {
    return (
        typeof name === 'string' &&
        typeof type === 'string' &&
        typeof place === 'string' &&
        typeof contact === 'string' &&
        name.trim()!=='' &&
        type.trim()!=='' &&
        place.trim()!=='' &&
        contact.trim()!=='' 
    )
}

const patchItemValidation = ({name,type,place,contact}) => {
    const fields = {name, type, place, contact}
    let validatedPatch = Object.entries(fields).filter(([,value]) => value !== undefined)

    if (validatedPatch.length===0){
        return false
    }

    const isInValid = validatedPatch.some(([,value])=> typeof value !== 'string' || value.trim()==='')
    if(isInValid){
        return false
    }
    return Object.fromEntries(validatedPatch.map(([key,value])=>[key,value.trim()]))
}

const getItem = async(req,res) => {
    try {
        const item = await prisma.item.findMany({
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
        return res.status(200).json(item)
    } catch (err) {
        return res.status(500).json({ message: 'server error' })
    }
}

const createItem = async(req, res) => {
    let {name,type,place,contact} = req.body
    if (!validation({name,type,place,contact})){
        return res.status(400).json({ message: 'invalid credentials' })
    }

    try {
        const item = await prisma.item.create({
            data: {
                name,
                type,
                place,
                contact,
                userId: req.user.id
            }
        })
        return res.status(201).json(item)
    }
    catch (err) {
        return res.status(500).json({ message: 'server error' })
    }
}

const patchItem = async(req,res) => {
    const itemId = Number(req.params.itemId)
    if (!Number.isInteger(itemId) || itemId <= 0){
        return res.status(400).json({message: 'invalid itemId'})
    }
    const userId = req.user.id
    let {name,type,place,contact} = req.body
    const patchItem = patchItemValidation({name,type,place,contact})
    if (!patchItem){
        return res.status(400).json({message: 'invalid request'})
    }
    try{
        const updateResult = await prisma.item.updateMany({
            where: {
                id: itemId,
                userId: userId
            },
            data: patchItem
        })
        if (updateResult.count === 0) {
            return res.status(404).json({message: 'item not found'})
        }
        const updatedItem = await prisma.item.findUnique({
            where: {
                id: itemId
            }
        })
        return res.status(200).json(updatedItem)
    }
    catch (err) {
        return res.status(500).json({message: "server error"})
    }
}

const updateItemStatus = async (req, res) => {
    const itemId = Number(req.params.itemId)
    const { status } = req.body

    if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(400).json({message: 'invalid itemId'})
    }

    if (status !== 'open' && status !== 'claimed') {
        return res.status(400).json({message: 'invalid status'})
    }

    try {
        const updateResult = await prisma.item.updateMany({
            where: {
                id: itemId,
                userId: req.user.id
            },
            data: {
                status
            }
        })

        if (updateResult.count === 0) {
            return res.status(404).json({message: 'item not found'})
        }

        const updatedItem = await prisma.item.findUnique({
            where: {
                id: itemId
            }
        })
        return res.status(200).json(updatedItem)
    } catch (err) {
        return res.status(500).json({message: 'server error'})
    }
}

const deleteItem = async (req, res) => {
    const itemId = Number(req.params.itemId)
    if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(400).json({message: 'invalid itemId'})
    }

    try {
        const deleteResult = await prisma.item.deleteMany({
            where: {
                id: itemId,
                userId: req.user.id
            }
        })

        if (deleteResult.count === 0) {
            return res.status(404).json({message: 'item not found'})
        }

        return res.status(204).send()
    } catch (err) {
        return res.status(500).json({message: 'server error'})
    }
}

module.exports = {
    getItem,
    createItem,
    patchItem,
    updateItemStatus,
    deleteItem
}
