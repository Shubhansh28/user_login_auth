const userService = require('../services/user.service')

const roleChange = async(req,res) => {
    const userId = Number(req.params.userId)
    const role = req.body.role
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({message: 'invalid userId'})
    }
    if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({message: 'invalid role'})
    }
    try {
        const updatedResult = await userService.updateUserRole(userId,role)
        if (updatedResult.count === 0) {
            return res.status(404).json({message: 'user not found'})
        }
        const updatedUser = await userService.findUserById(userId)
        return res.status(200).json({updatedUser})
    }
    catch (err) {
        return res.status(500).json({message: "server error"})
    }
}

const getUserOverview = async(req,res) => {
    try{
        const userStats = await userService.userStats()
        return res.status(200).json(userStats)
    }
    catch (err) {
        return res.status(500).json({ message: 'server error' })
    }
}

const getUserHistory = async(req,res) => {
    const userId = Number(req.params.userId)
    if (!Number.isInteger(userId) || userId <= 0){
        return res.status(400).json({message: 'invalid userId'})
    }
    try{
        const userHistory = await userService.userHistory(userId)
        if (!userHistory){
            return res.status(404).json({message: 'user not found'})
        }
        return res.status(200).json(userHistory)
    }
    catch (err) {
        return res.status(500).json({ message: 'server error' })
    }
}

module.exports = {
    roleChange,
    getUserOverview,
    getUserHistory
}