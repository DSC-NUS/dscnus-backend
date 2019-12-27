const express = require('express')
const nodemailer = require('nodemailer')
const router = new express.Router()

router.post('/send', (req, res) => {
    if(req.body.email == "" || req.body.message == "") {
        console.log("email and subject error")
        return res.status(400).send("Error: Email & Subject should not be blank");
    }

    var smtpTransport = nodemailer.createTransport({
        // service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        }
    })
    console.log(smtpTransport)

    var mailOptions = {
        from: 'tansuyee.dscnus@gmail.com',
        to: 'tansuyee.dscnus@gmail.com', 
        subject: 'Message from DSC NUS Website',
        text:  req.body.email + ' ' + req.body.firstname + ' ' + req.body.lastname + ': ' + req.body.message
    }

    console.log(mailOptions)

    smtpTransport.sendMail(mailOptions, (e, res) => {
        if (e) {
            console.log(e)
            res.status(400).send({ error });
        } else {
            res.send({ success: true });
        }
    })
})

module.exports = router