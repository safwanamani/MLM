const express = require('express');
const routes = require("./routes/auth")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/public", express.static("public"))
app.use("/",express.static("public/js"))
app.set('view engine', 'ejs')

app.use('/', routes)

module.exports = { app }
