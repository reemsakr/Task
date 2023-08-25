const express = require('express')
//const User = require('../Models/Author')
const router = express.Router()
const AuthorModel = require('../Models/Author')
const Joi = require('@hapi/joi')
//const bcrypt = require('bcrypt')
//const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyjwt')

router.get('/books', verifyToken, async (req, res) => {
    const books = await AuthorModel.aggregate([
        {
            $lookup:
            {
                from: 'Book',
                localField: 'author_id',
                foreignField: '_id',
                as: 'booksdetails'
            }
        }
    ])
    try {
        res.send(books)
    }
    catch (err) {
        res.send(err)
    }

})


router.get('/allAuthor', verifyToken, async (req, res) => {
    const Authors = await AuthorModel.find()
    try {
        res.send(Authors)
    }
    catch (err) {
        res.send(err)
    }

})

router.post('/addAuthor', verifyToken, async (req, res) => {

    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).email().required()

    }
    const { error } = Joi.validate(req.body, schema)

    if (error) return res.send(error.details[0].message)



    const Author = new AuthorModel({
        name: req.body.name,
        email: req.body.email
    })
    const save = await Author.save()
    try {
        res.send(save)
    }
    catch (err) {
        res.send(err)
    }

})


router.get('/getAuthor/:id', verifyToken, async (req, res) => {
    const id = req.params.id

    const Author = await AuthorModel.findById(id)
    try {
        res.send(Author)
    }
    catch (err) {
        res.send(err)
    }

})


router.delete('/deleteAuthor/:id', verifyToken, async (req, res) => {
    const id = req.params.id
    const Author = await AuthorModel.remove({ _id: id })

    try {
        res.send(Author)
    }
    catch (err) {
        res.send(err)
    }
})

router.patch('/updateAuthor/:id', verifyToken, async (req, res) => {
    const id = req.params.id

    const updatedAuthor = await AuthorModel.updateOne(
        { _id: id },
        {
            $set: req.body
        }
    )
    try {
        res.send(updatedAuthor)
    }
    catch (err) {
        res.send(err)
    }

})

module.exports = router