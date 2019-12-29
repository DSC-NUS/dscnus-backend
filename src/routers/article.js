const express = require('express')
const cors = require('cors')
const router = new express.Router()
const Article = require('../models/article')
const auth = require('../middleware/auth')

router.post('/articles', cors(), async (req, res) => {
    const article = new Article({
        ...req.body
    })
    try {
        await article.save()
        res.status(201).send(article)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/articles', cors(), async (req, res) => {
    // const match = {}
    const sort = {}

    try {
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            value = (parts[1] === 'desc') ? -1 : 1
            const articles = await Article.find({}).sort({ "created_at": value }).limit(20)
            res.send(articles)
        } else {
            const articles = await Article.find({}).limit(20)
            res.send(articles)
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'A server error occurred.' })
    }
})

router.get('/articles/:id', cors(), async (req, res) => {
    const _id = req.params.id
    try {
        const article = await Article.findById(_id)
        if (!article) {
            return res.status(404).send()
        }
        res.send(article)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.patch('/articles/:id', cors(), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'body']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const article = await Article.findById(req.params.id)
        if (!article) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            article[update] = req.body[update]
        })
        await article.save()
        res.send(article)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/articles/:id', cors(), async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id)
        if (!article) {
            return res.status(404).send()
        }
        res.send(article)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router