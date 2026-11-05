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
        return res.status(200).json({
            "success": true,
            "message": "User role updated successfully"
        })
    }
    catch (err) {
        return res.status(500).json({message: "server error"})
    }
}

module.exports = {
    roleChange
}