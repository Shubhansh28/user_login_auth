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
    let isValid = true
    if (name){
        isValid = isValid && typeof name === 'string' &&  name.trim()!==''
    }
    if (type){
        isValid =  isValid && typeof type === 'string' && type.trim()!==''
    }
    if (place){
        isValid =  isValid && typeof place === 'string' && place.trim()!==''
    }
    if (contact){
        isValid =  isValid && typeof contact === 'string' && contact.trim()!==''
    }
    return isValid
}

const Rectifier = ({name,type,place,contact}) => {
    name = name?name.trim():undefined
    type = type?type.trim():undefined
    place = place?place.trim():undefined
    contact = contact?contact.trim():undefined
    return {name,type,place,contact}
}

const getItem = async(req,res) => {
    try {
        const item = await prisma.item.findMany({
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
    if (!itemId){
        return res.status(400).json({message: 'invalid itemId'})
    }
    const userId = req.user.id
    let {name,type,place,contact} = req.body
    if (!patchItemValidation({name,type,place,contact})){
        return res.status(400).json({message: 'invalid request'})
    }
    try{
        const item = await prisma.item.update({
            where: {
                id: itemId,
                userId: userId
            },
            data: Rectifier({name,type,place,contact})
        })
        const updatedItem = await prisma.item.findUnique({
            where: {
                id: itemId
            }
        })
        return res.status(201).json(updatedItem)
    }
    catch (err) {
        return res.status(500).json({message: "access Denied"})
    }
}

module.exports = {
    getItem,
    createItem,
    patchItem
}
