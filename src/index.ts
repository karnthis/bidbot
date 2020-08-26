import * as Discord from 'discord.js'
import * as DotEnv from 'dotenv'
import {Message} from "discord.js";

DotEnv.config()
const dClient = new Discord.Client()

const users = [
    {
        name: 'bob',
        koins: 50,
        group: '-HC-'
    },
    {
        name: 'ken',
        koins: 50,
        group: 'ADS'
    }
]


// const bidIsActive = true

dClient.on(`ready`, () => {
    console.log(`Started Successfully`)
})

dClient.on('message', (message: Message) => {
    if (message.author.bot) {
        console.log('bot detected')
        return;
    }
    if (message.guild) {
        message.channel.send('DM me for testing');
        return;
    } else if (message.content.startsWith('$info')) {
        message.channel.send(`
        Commands available:
        - \$status [name] : Console Logs status of the user
        - \$adminstatus : Console Logs status of all users
        `);
    } else if (message.content.startsWith('$status')) {
        const username = message.content.split(' ')[1];
        if (username) {
            console.dir(users.filter(el => el.name == username)[0])
            message.channel.send('check logs');
        } else {
            message.channel.send('user not found');
        }
    } else if (message.content.startsWith('$adminstatus')) {
        console.dir(users)
        message.channel.send('check logs');
    }
});


dClient.login(process.env.DISCORD_TOKEN)