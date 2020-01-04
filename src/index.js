const express = require('express')
require('./db/mongoose')

const articleRouter = require('./routers/article')
const emailRouter = require('./routers/email')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(articleRouter)
app.use(emailRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/', function(req, res){
    res.redirect('/articles');
});