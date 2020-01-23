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
/*bot.on('text', (ctx) => {
    ctx.reply('Hello World')
})*/
bot.start(ctx => {
    ctx.reply("start wut?")
})
exports.bot = functions.https.onRequest((req, res) => {
    bot.handleUpdate(req.body, res)
})
