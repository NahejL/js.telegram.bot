const functions = require('firebase-functions');
const admin = require('firebase-admin')
const Telegraf = require('telegraf')

admin.initializeApp()

let botToken 
{
    admin.firestore().collection('root').doc('bot').get()
    .then(snapshot => {
        return botToken = snapshot.token
    })
    .catch(error => {
        console.error(error)
    })
}

let bot = new Telegraf(botToken)

//`https://api.telegram.org/bot${botToken}/getWebhookInfo`

bot.hears('elsa', ctx => {
    ctx.reply('Dum')
})

bot.catch((error, ctx) => {
    console.error(error)
    ctx.reply('Ouch')
})

exports.bot = functions.https.onRequest((req, res) => {
    console.log(req.body)
    bot.handleUpdate(req.body, res)
    
})
