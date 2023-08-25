const express = require('express')
//const User = require('../Models/User')
const router = express.Router()
const UserModel = require('../Models/User')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
//const jwt=require('jsonwebtoken')
const verifyToken = require('../middleware/verifyjwt')
const jwt =require('jsonwebtoken')

router.post('/login',async (req,res)=>{
    const user =await UserModel.findOne({email:req.body.email})
    if(!user)return res.send('Invalid email !!')
    const passwordVerfication =await bcrypt.compare(req.body.password,user.password)
    if(!passwordVerfication)return res.send('Invalid password')
    const token=  jwt.sign({_id:user._id},process.env.SECRET)

    user.password=undefined
    res.json({
        body:{
            user:user,
            token:token
        }
    })
})

router.post('/logout',verifyToken, async (req, res)=> {
    try{
        
        const token=req.headers.authorization.split(' ')[1]
        
        if(!token)
        {
            res.status(401).json({data:'Authorization fail !'})
        }
        
        await UserModel.findByIdAndUpdate(req.user._id,{tokens:[]})
        res.status(200).json(
            {
                data:'logout successfully'
            }
        )
    }
    catch(err)
    {
        res.status(400).json({
            data:err
        })
    }
})


router.get('/allUsers', verifyToken, async (req, res) => {
    const users = await UserModel.find()
    try {
        res.send(users)
    }
    catch (err) {
        res.send(err)
    }

})

router.post('/signup', async (req, res) => {

    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).email().required(),
        password: Joi.string().min(3).required()

    }
    const { error } = Joi.validate(req.body, schema)

    if (error) return res.send(error.details[0].message)

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })



    const check = await UserModel.findOne({ email: user.email })
        
    if (!check) {
        try {
            const save = await user.save()
            res.status(201).json({
                data:save
            })
        }
        catch(err)
        {
                
            res.status(400).json({
                data:err})
        }
    }
    else {
        res.status(400).json({
            data:'sorry dublicated email'})
        
    }

})


router.get('/getUser/:id', verifyToken, async (req, res) => {
    const id = req.params.id

    const user = await UserModel.findById(id)
    try {
        res.send(user)
    }
    catch (err) {
        res.send(err)
    }

})


router.delete('/deleteUser/:id', verifyToken, async (req, res) => {
    const id = req.params.id
    const user = await UserModel.remove({ _id: id })

    try {
        res.send(user)
    }
    catch (err) {
        res.send(err)
    }
})

router.patch('/updateUser/:id', verifyToken, async (req, res) => {
    const id = req.params.id

    const updatedUser = await UserModel.updateOne(
        { _id: id },
        {
            $set: req.body
        }
    )
    try {
        res.send(updatedUser)
    }
    catch (err) {
        res.send(err)
    }

})

module.exports = router