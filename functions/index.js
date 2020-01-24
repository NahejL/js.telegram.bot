const functions = require('firebase-functions');
const admin = require('firebase-admin')
const Telegraf = require('telegraf')
const Express = require('express')

(async () => {
    admin.initializeApp()

    const botToken = (await admin.firestore().collection('root').doc('bot').get()).token

    //Set bot
    const bot = new Telegraf(botToken)
    bot.hears('elsa', ctx => {
        ctx.reply('Dum')
    })

    bot.catch((error, ctx) => {
        console.error(error)
        ctx.reply('Ouch')
    })

    //Set express
    const express = Express()
    //`https://api.telegram.org/bot${botToken}/getWebhookInfo`
    express.use(`/${botToken}`, async (req, res) => {
        try {
            //Before bot
            let updates = req.body
            
            console.log(updates)
        
            if (!Array.isArray(updates)) updates = [updates]
        
            await bot.handleUpdates(updates, res);
        
            //After bot
            if (!res.finished) {
              return res.end();
            }
            return Promise.resolve(res);
        } 
        catch (err) {
            console.error('Webhook error', err);
            res.writeHead(500);
            return res.end();
        }
    })

    //Set function
    const functionName = "bot"
    exports[functionName] = functions.https.onRequest(express)
    bot.telegram.setWebhook(`https://${functions.config.bot.region}-${process.env.GCP_PROJECT}.cloudfunctions.net/${functionName}/${botToken}`)
})()