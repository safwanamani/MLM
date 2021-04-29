const { app } = require("../server")
const User = require("../models/user")


const referralCodeGenerator = require('referral-code-generator')

exports.register = async(req, res)=>{
    console.log(req.query.id)
    res.render('register')
}

exports.addRegister = async(req,res)=>{
    try {
        console.log(req.body);
        //Checking user already exist or not
        var userCode = referralCodeGenerator.alphaNumeric('lowercase',2,2)
        console.log("userCode  "+userCode)
 
        const user = await User.findOne({email:req.body.email})
        const referalUser = await User.findOne({referelCode: req.body.referelCode})

        if (!user) {

            let {name, email, phone} = req.body

            let _user = new User({name, email, phone})

            _user.save().then(() => {
                if (referalUser) {
                    if (req.body.child == 'left') {
                        inOrderLeft(referalUser)
                    } else if (req.body.child == 'right') {
                        inOrderRight(referalUser)
                    }
                } else {
                    res.send("Can't find your referel")
                }
            })
            .catch(err => {
                console.log(err);
            })

            let symmetric = async(parent, user) => {
                let newUser = await User.findOne({_id: parent})

                let twochild = async(left, right) => {
                    let leftUser = await User.findOne({_id: left})
                    let rightUser = await User.findOne({_id: right})
                    if (leftUser.leftChild && leftUser.rightChild && rightUser.leftChild && rightUser.rightChild) {
                        twochild(leftUser.leftChild, leftUser.rightChild)
                        twochild(rightUser.leftChild, rightUser.rightChild)
                    } else if (!leftUser.leftChild && !leftUser.rightChild && !rightUser.leftChild && !rightUser.rightChild) {
                        console.log("Level "+leftUser.level);
                        console.log("User level "+ _user.level);
                        console.log("Right Level "+ rightUser.level);
                        if (_user.level == leftUser.level) {
                            newUser.matchingPoint += 50

                            newUser.save()

                            if (newUser.parent) {
                                symmetric(newUser.parent, newUser._id)
                            }
                        }
                    }
                }

                if (newUser.rightChild) {
                    if (newUser.rightChild != user) {
                        let newuser = await User.findOne({_id: newUser.rightChild})

                        twochild(newuser.leftChild, newuser.rightChild)
                    }
                } else if (newUser.leftChild) {
                    if (newUser.leftChild != user) {
                        let newuser = await User.findOne({_id: newUser.leftChild})

                        twochild(newuser.leftChild, newuser.rightChild)
                    }
                }
            }

            let inOrderLeft =async (root) => {
                    let new_user = await User.findOne({_id: root.leftChild})
                    
                    if (new_user) {
                        inOrderLeft(new_user)
                    } else {
                        let new_user = await User.findOne({_id: root._id})

                        if (root.rightChild) {

                            let new_user = await User.findOne({_id: root._id})
                            new_user.matchingPoint += 50

                            if (root.parent) {
                                symmetric(root.parent, root._id)
                            }

                            new_user.save()
                            // let newUser = await User.findOne({_id: root.rightChild})

                            // if (!newUser.leftChild && !newUser.rightChild) {
                                // let new_user = await User.findOne({_id: root._id})
                                // new_user.matchingPoint += 50

                                // symmetric(root.parent, root._id)

                                // new_user.save()
                            // }
                        }

                        _user.parent = root._id
                        _user.referenceId = referalUser._id
                        _user.referelCode = userCode
                        _user.level = root.level + 1
                        
                        new_user.leftChild = _user._id
                        referalUser.referncePoint += 100

                        console.log(root);

                        referalUser.save()

                        new_user.save()

                        _user.save()
                            .then(
                                console.log("New User Created")
                            )
                            .catch(err => {
                                res.send(err)
                            })
                            
                    }
            }

            let inOrderRight = async (root) => {
                let right_user = await User.findOne({_id: root.rightChild})

                if (right_user) {
                    inOrderRight(right_user)
                } else {
                    let new_user = await User.findOne({_id: root._id})

                    if (root.leftChild) {
                        let new_user = await User.findOne({_id: root._id})
                            new_user.matchingPoint += 50

                            if (root.parent) {
                                symmetric(root.parent, root._id)
                            }

                            new_user.save()
                    }

                    _user.parent = root._id
                    _user.referenceId = referalUser._id
                    _user.referelCode = userCode
                    _user.level = root.level + 1
                    
                    new_user.rightChild = _user._id

                    referalUser.referncePoint += 100

                    referalUser.save()

                    new_user.save()

                    _user.save()
                        .then(
                            console.log("New User Created")
                        )
                        .catch(err => {
                            res.send(err)
                        }) 
                }
            }

            return res.json({
                status: true,
                referel: referalUser._id
            })
    
        } else {
            console.log("User already exist");
        }
    }
    catch(error) { 
        console.log(error);
    }
}

exports.home = async(req, res) => {
    let user1 = ""
    if (req.query.id) {
        user1 = await User.findOne({_id: req.query.id}).populate('leftChild').populate('rightChild')
    } else {
        let users = await User.find()
        user1 = await User.findOne({_id: users[0]}).populate('leftChild').populate('rightChild')
    }
    let user2 = ""
    let user3 = ""

    if (user1.leftChild) {
        user2 = await User.findOne({_id: user1.leftChild._id}).populate('leftChild').populate('rightChild')
    }

    if (user1.rightChild) {
        user3 = await User.findOne({_id: user1.rightChild._id}).populate('leftChild').populate('rightChild')
    }


    res.render('home', {
        user1: user1,
        user2: user2,
        user3: user3
    })
}

exports.getUsers = async(req, res) => {
    let users = await User.find()



}