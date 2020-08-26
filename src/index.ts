import * as Discord from 'discord.js'
import * as DotEnv from 'dotenv'
import {Message} from "discord.js";

DotEnv.config()
const dClient = new Discord.Client()


const bidIsActive = true

dClient.on(`ready`, () => {
    console.log(`Started Successfully`)
})

dClient.on('message', (message: Message) => {
    if (message.content.startsWith('$')) {
        // message.channel.send('Bid Test Passed');
        if (bidIsActive) {
            message.channel.send('done')
        }

    } else {
        // Do Nothing
    }
});


dClient.login(process.env.DISCORD_TOKEN)