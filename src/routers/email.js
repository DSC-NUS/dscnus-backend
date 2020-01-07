const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')
const router = new express.Router()

router.post('/send', (req, res, next) => {
    if(req.body.email == "" || req.body.message == "") {
        // console.log("email and subject error")
        return res.status(400).send("Error: Email & Subject should not be blank");
    }

    var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        // host: 'smtp.gmail.com',
        // port: 465,
        // secure: true,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    })
    console.log("transport: " + smtpTransport)

    var mailOptions = {
        from: 'tansuyee.dscnus@gmail.com',
        to: 'tansuyee.dscnus@gmail.com', 
        subject: 'Message from DSC NUS Website',
        text:  req.body.email + ' ' + req.body.firstname + ' ' + req.body.lastname + ': ' + req.body.message
    }

    console.log("mailOptions: " + mailOptions)

    smtpTransport.sendMail(mailOptions, (e, res) => {
        if (e) {
            res.status(400).send({ error });
        } else {
            res.send({ success: true });
            next()
        }
    })
})

module.exports = router