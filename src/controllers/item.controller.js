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

const getItem = async(req,res) => {
    try {
        const item = await prisma.item.findMany()
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

module.exports = {
    getItem,
    createItem
}
