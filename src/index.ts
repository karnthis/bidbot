import * as Discord from 'discord.js'
import * as DotEnv from 'dotenv'
import {GuildMember, Message, User} from "discord.js";
import {UserInterface} from './interfaces/user.interface'
import {MoonInterface} from './interfaces/moon.interface'
import {AuctionMoonInterface} from "./interfaces/auction.moon.interface";
import {tableBuilder} from './sql/tables.sql'
import * as Sql from 'better-sqlite3';
import * as Dayjs from 'dayjs'

import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

const db = new Sql('./src/sql/data.sqlite', {});
db.exec(tableBuilder.users)
db.exec(tableBuilder.moons)
db.exec(tableBuilder.auctions)
db.exec(tableBuilder.groups)
const userSql = db.prepare('select * from users')

const users: UserInterface[] = userSql.all()
Dayjs().format()
Dayjs.extend(utc)
Dayjs.extend(timezone)

DotEnv.config()
const DClient = new Discord.Client()
const prefix = ''

const moons: MoonInterface[] = [
    {
        location: 'Moon 1',
        id: 1234,
        details: 'blah',
        status: 'available',
    },
    {
        location: 'Moon 2',
        id: 4321,
        details: 'blah',
        status: 'available',
    },
]

const activeAuctions: AuctionMoonInterface[] = [
    // starts empty
]

DClient.on(`ready`, () => {
    console.log(`Started Successfully`)
})

// Bot Message Logic
DClient.on('message', (message: Message) => {
    const guild = message.guild
    const authedBidder = guild.roles.cache.find(role => role.name === 'Authorized Bidder')
    const bidAdmin = guild.roles.cache.find(role => role.name === 'Bid Admin')
    if (message.author.bot) {
        // Do nothing
        // console.log('bot detected')
    }
    const parts = message.content.split(' ');
    if (false && message.guild) {
        const roles = message.member.roles.cache.array()
        console.dir(roles.map(role => { return {id: role.id, name: role.name}})) //.find(role => role.id == '746851594854989855')
    } else if (false && message.guild) {
        message.channel.send('DM a me for testing');
        message.author.send(`Use ${prefix}info to get list of commands`)

    } else if (message.content.startsWith(`${prefix}info`)) {
        message.channel.send(helpText())

    } else if (message.content.startsWith(`${prefix}manager`)) {
        if (!message.member.roles.cache.find((role) => role == bidAdmin)) {
            message.channel.send('Not Authorized')
            return
        }
        if (!message.mentions.roles.array().length) {
            // console.log('no mention')
            message.channel.send('Mention the User(s) you wish to register')
        } else {
            // console.log('mention')
            message.mentions.roles.forEach((member) => console.log(member.name, typeof member.id))
            // message.mentions.members.forEach((member:GuildMember) => member.roles.add(authedBidder))
            message.channel.send('Access updated')
        }

        // message.author.send('To register, please reply with a mention to yourself.')

    } else if (message.content.startsWith(`${prefix}register`)) {
        if (!message.member.roles.cache.find((role) => role == bidAdmin)) {
            message.channel.send('Not Authorized')
            return
        }
        if (!message.mentions.users.array().length) {
            // console.log('no mention')
            message.channel.send('Mention the User(s) you wish to register')
        } else {
            // console.log('mention')
            message.mentions.members.forEach((member:GuildMember) => member.roles.add(authedBidder))
            message.channel.send('Access updated')
        }

        // message.author.send('To register, please reply with a mention to yourself.')

    } else if (message.content.startsWith(`${prefix}revoke`)) {
        if (!message.member.roles.cache.find((role) => role == bidAdmin)) {
            message.channel.send('Not Authorized')
            return
        }
        if (!message.mentions.users.array().length) {
            // console.log('no mention')
            message.channel.send('Mention the User(s) access you wish to revoke')
        } else {
            // console.log('mention')
            message.mentions.members.forEach((member:GuildMember) => member.roles.remove(authedBidder))
            message.channel.send('Access updated')
        }

        // message.author.send('To register, please reply with a mention to yourself.')

    } else if (message.mentions.users.find((user: User) => user == message.author)) {
        // message.channel.send('Instructions sent via DM')
        message.author.send('Registered!').then(msg => {

        })

    } else if (message.content.startsWith(`${prefix}auction`)) {
        if (!parts[1]) {
            if (activeAuctions.length) {
                message.author.send('Active Auctions:')
                generateMoonList(message, activeAuctions)
            } else {
                message.channel.send('No Active Auctions')
            }
        } else {
            const auctionId = Number(parts[1])
            if (isNaN(auctionId)) {
                message.channel.send('Invalid Moon ID')
            } else {
                const targetMoon = moons.find(moon => moon.id == auctionId)
                const auctionFields = {
                    currentHighBidder: '',
                    currentBid: 0,
                    timeRemaining: Dayjs().add(1,'day'),
                }
                const newAuctionMoon = {...targetMoon, ...auctionFields}
                activeAuctions.push(newAuctionMoon)
                message.channel.send([
                    `Beginning Auction:`,
                    buildAuctionString(newAuctionMoon)
                ].join('\n'))
            }
        }

    } else if (message.content.startsWith(`${prefix}bid`)) {
        if (!parts[1]) {
            message.channel.send('Please provide a bid');
        } else if (parts[2] != 'on') {
            message.channel.send(`Please provide in format "${prefix}bid [amount] on [MoonId]`)
        } else {
            const bidValue = Number(parts[1])
            const moonId = Number(parts[3])
            const moon = activeAuctions.find(moon => moon.id = moonId)
            if (isNaN(bidValue)) {
                message.author.send(`Invalid bid value on ${moonId}`)
            } else if (isNaN(moonId)) {
                message.author.send('Invalid Moon ID')
            } else if (moon.currentBid >= bidValue) {
                message.channel.send(`Please bid higher than the current bid of ${moon.currentBid}`)
            } else {
                moon.currentBid = bidValue
                moon.currentHighBidder = 'user'
                if (moon.timeRemaining.isBefore(Dayjs().add(1, 'hour'))) {
                    moon.timeRemaining.add(1, 'hour')
                }
                message.channel.send([
                    `Bid Received`,
                    buildAuctionString(moon)
                ].join('\n'))
            }
        }

        // inventory
    } else if (message.content.startsWith(`${prefix}inventory`)) {
        generateMoonList(message, moons)

    } else if (message.content.startsWith(`${prefix}status`)) {
        const username = message.content.split(' ')[1];
        if (username) {
            console.dir(users.filter(el => el.name == username)[0])
            message.channel.send('check logs');
        } else {
            message.channel.send('user not found');
        }

    } else if (message.content.startsWith(`${prefix}adminstatus`)) {
        console.dir(users)
        message.channel.send('check logs');

    }
});


DClient.login(process.env.DISCORD_TOKEN)

// Logic Functions
// function generateMoonList(message:Message, moons: MoonInterface[]|AuctionMoonInterface[], isAuctions?: boolean): void {
//     moons.filter(moon => moon.status != 'owned').forEach((moon: AuctionMoonInterface|MoonInterface) => {
//         const moonString = (isAuctions) ? buildAuctionString(moon) : buildMoonString(moon)
//         message.author.send(moonString)
//     })
// }

function isAuctions(moon: MoonInterface | AuctionMoonInterface): moon is AuctionMoonInterface { // this is what TS calls a Type Guard
    return 'currentBid' in moon;
}

function generateMoonList(message:Message, moons: MoonInterface[]|AuctionMoonInterface[]): void {
    moons.filter(moon => moon.status != 'owned').forEach((moon: AuctionMoonInterface|MoonInterface) => {
        const moonString = isAuctions(moon) ? buildAuctionString(moon) : buildMoonString(moon)
        message.author.send(moonString)
    })
}

function helpText(): string {
    return [
        'Commands available:```md',
        `- ${prefix}status [name] : Console Logs status of the user`,
        `- ${prefix}adminstatus : Console Logs status of all users`,
        `- ${prefix}auction [moonID] : get list of active auctions or start a new one`,
        `- ${prefix}bid [amount] on [auction] : Place a bid on an auction`,
        `- ${prefix}inventory : See a list of all available moons`,
        '```'
    ].join('\n')
}


// Utility functions
function buildMoonString(moon: MoonInterface): string {
    // function buildMoonString(moon): string {
    return [
        '```',
        `${moon.location}`,
        `ID: ${moon.id}`,
        `status: ${moon.status}`,
        `${moon.details}`,
        '```',
    ].join('\n')
}

function buildAuctionString(moon: AuctionMoonInterface): string {
//     function buildAuctionString(moon): string {
    return [
        '```',
        `${moon.location}`,
        `ID: ${moon.id}`,
        `Current Bid: ${moon.currentBid}`,
        `Current High Bidder: tbd`,
        `Finishes: ${moon.timeRemaining}`,
        '```',
    ].join('\n')
}