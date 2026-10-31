const express = require('express')
const { authenticate } = require('../middleware/authenticate')
const {
    getItem,
    createItem,
    patchItem,
    updateItemStatus,
    deleteItem
} = require('../controllers/item.controller')
const router = express.Router()

router.get("/",authenticate,getItem)
router.post("/",authenticate,createItem)
router.patch("/:itemId/status",authenticate,updateItemStatus)
router.patch("/:itemId",authenticate,patchItem)
router.delete("/:itemId",authenticate,deleteItem)

module.exports = router