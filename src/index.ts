import * as Discord from 'discord.js'
import * as DotEnv from 'dotenv'
import {Message} from "discord.js";
import {UserInterface} from './interfaces/user.interface'
import {MoonInterface} from './interfaces/moon.interface'

DotEnv.config()
const dClient = new Discord.Client()

const users: UserInterface[] = [
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



const moons: MoonInterface[] = [
    {
        name: 'Moon 1',
        id: 1234,
        details: 'blah',
    },
    {
        name: 'Moon 2',
        id: 4321,
        details: 'blah',
    },
]


dClient.on(`ready`, () => {
    console.log(`Started Successfully`)
})

dClient.on('message', (message: Message) => {
    if (message.author.bot) {
        console.log('bot detected')
    }
    const parts = message.content.split(' ');
    if (message.guild) {
        message.channel.send('DM me for testing');
        message.author.send('use $info to get list of commands')
    } else if (message.content.startsWith('$info')) {
        message.channel.send([
            'Commands available:',
            '- $status [name] : Console Logs status of the user',
            '- $adminstatus : Console Logs status of all users',
        ].join('\n'))
    } else if (message.content.startsWith('$auction')) {
        if (!parts[1]) {
            message.channel.send('Please provide a Moon ID');
        } else {
            const auctionId = Number(parts[1])
            if (isNaN(auctionId)) {
                message.channel.send('Invalid Moon ID')
            } else {
                const targetMoon = moons.filter(moon => moon.id == auctionId)
                message.channel.send([
                    `Moon on auction:`,
                    buildMoonString(targetMoon[0])
                ].join('\n'))
            }
        }
    } else if (message.content.startsWith('$bid')) {
        if (!parts[1]) {
            message.channel.send('Please provide a bid');
        } else {
            const bidValue = Number(parts[1])
            if (isNaN(bidValue)) {
                message.channel.send('Invalid bid')
            } else {

            }
        }
    } else if (message.content.startsWith('$inventory')) {
        moons.forEach((moon: MoonInterface) => {
            message.channel.send(buildMoonString(moon))
        })
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


// functions
function buildMoonString(moon) {
    return [,
        `${moon.name}`,
        `ID: ${moon.id}`,
        `Moon Details Here`
    ].join('\n')
}