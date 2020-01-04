const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
require('./db/mongoose')

const articleRouter = require('./routers/article')
const emailRouter = require('./routers/email')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.static('public'))
app.use(favicon(path.join('public', '../public/favicon.ico')))
app.use(articleRouter)
app.use(emailRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})