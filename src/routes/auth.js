const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

router.post("/addregister",userController.addRegister)
router.get("/register", userController.register)
router.get("/", userController.home)
router.get("/getusers", userController.getUsers)

module.exports = router
