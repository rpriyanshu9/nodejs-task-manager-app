require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'praj39@myamu.ac.in',
        subject: 'Thanks for signing up',
        text: `Welcome to the app, ${name}!`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'praj39@myamu.ac.in',
        subject: 'Bid You Adieu',
        text: `Sorry to see you go. Please spare a moment to tell us what went wrong with us.`
    })
}

module.exports = {
    sendWelcomeEmail, sendCancellationEmail
}