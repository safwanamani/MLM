const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    },
    referenceId:{
        type: mongoose.Schema.Types.ObjectId
    },
    referelCode:{
        type: String
    },
    referncePoint:{
        type:Number,
        default:0
    },
    matchingPoint:{
        type:Number,
        default:0
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId
    },
    leftChild:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    rightChild:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    rootParent: {
        type: mongoose.Schema.Types.ObjectId
    },
    level: {
        type:Number
    }
})

module.exports = users = mongoose.model('users',userSchema)