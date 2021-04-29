const express = require('express');
const vhost = require('vhost')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const routes = require("./routes/auth")

app.use("/public", express.static("public"))
app.use("/",express.static("public/js"))
app.set('view engine', 'ejs')

// app.use("/", routes)

app.use(vhost('localhost', routes))

module.exports = {
    app
}
