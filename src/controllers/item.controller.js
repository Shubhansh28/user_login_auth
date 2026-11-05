const { FetchItems,insertIntoItem,patchIntoItem,findItem,patchIntoItemStatus,deleteFromItem } = require('../services/item.service')
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
        const item = await FetchItems()
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
        const userId = req.user.id
        const item = await insertIntoItem({name,type,place,contact,userId})
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
    const role = req.user.role
    let {name,type,place,contact} = req.body
    const patchItem = patchItemValidation({name,type,place,contact})
    if (!patchItem){
        return res.status(400).json({message: 'invalid request'})
    }
    try{
        const updateResult = await patchIntoItem(itemId,userId,role,patchItem)
        if (updateResult.count === 0) {
            return res.status(404).json({message: 'item not found'})
        }
        const updatedItem = await findItem(itemId)
        return res.status(200).json(updatedItem)
    }
    catch (err) {
        return res.status(500).json({message: "server error"})
    }
}

const updateItemStatus = async (req, res) => {
    const itemId = Number(req.params.itemId)
    const { status } = req.body
    const userId = req.user.id
    const role = req.user.role

    if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(400).json({message: 'invalid itemId'})
    }

    if (status !== 'open' && status !== 'claimed') {
        return res.status(400).json({message: 'invalid status'})
    }

    try {
        const updateResult = await patchIntoItemStatus(itemId,userId,role,status)

        if (updateResult.count === 0) {
            return res.status(404).json({message: 'item not found'})
        }

        const updatedItem = await findItem(itemId)
        return res.status(200).json(updatedItem)
    } catch (err) {
        return res.status(500).json({message: 'server error'})
    }
}

const deleteItem = async (req, res) => {
    const itemId = Number(req.params.itemId)
    const userId = req.user.id
    const role = req.user.role
    if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(400).json({message: 'invalid itemId'})
    }

    try {
        const deleteResult = await deleteFromItem(itemId,userId,role)

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
