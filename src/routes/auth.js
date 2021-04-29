const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

router.use((req,res, next) => {
    if (req.vhost.hostname == "localhost") {
        res.locals.app_url = "http://localhost:3000";
        res.locals.asset_url = "http://localhost:3000";
    }
    next();
});

router.post("/register",userController.addRegister)
router.get("/register", userController.register)
router.get("/", userController.home)
router.get("/getusers", userController.getUsers)

module.exports = router
