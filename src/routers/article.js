const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const multer = require('multer')
// const auth = require('../middleware/auth')

// var storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

const storage = multer.memoryStorage()

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    },
    storage
})

router.post('/articles', async (req, res) => {
    try {
        const isMatch = req.body.password === process.env.ARTICLE_PASSWORD
        if (isMatch) {
            const articleObject = {
                ...req.body
            }
            delete articleObject["picture"]
        
            var article = new Article(articleObject);
            await article.save()
            res.status(201).send({ id: article._id })
        } else {
            throw new Error('Wrong password')
        }
    } catch (e) {
        // console.log('err', e)
        res.status(400).send()
    }
})

router.post('/articles/:id/picture', upload.single('picture'), async (req, res) => {
    const article = await Article.findById(req.params.id)
    article.picture = req.file.buffer
    await article.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/articles', async (req, res) => {
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
        // console.log(e)
        res.status(500).send({ error: 'A server error occurred.' })
    }
})

router.get('/articles/:id/picture', async (req, res) => {
    const _id = req.params.id
    try {
        const article = await Article.findById(_id)
        if (!article) {
            return res.status(404).send()
        }
        res.set('Content-Type', 'image/png')
        res.send(article.picture)
    } catch (e) {
        // console.log(e)
        res.status(500).send()
    }
})

router.get('/articles/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const article = await Article.findById(_id)
        if (!article) {
            return res.status(404).send()
        }
        res.send(article)
    } catch (e) {
        // console.log(e)
        res.status(500).send()
    }
})

router.patch('/articles/:id', async (req, res) => {
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

router.delete('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id)
        if (!article) {
            return res.status(404).send()
        }
        res.send(article)
    } catch (e) {
        // console.log(e)
        res.status(500).send()
    }
})

module.exports = router