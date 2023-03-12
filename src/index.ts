//MTA4MzI1OTIxNTcwNTAyMjU1NQ.Gtnubl.No3lEZHQsIRWneqp8CBIS-OBPTQyYhf4npK7I8
import path from 'path'
import {config} from 'dotenv'
import * as Discord from './classes'
import { Events, GatewayIntentBits, Collection, CommandInteraction, Interaction} from 'discord.js'
import {ready,interactionCreate} from "./events" 
import logger from './log'
config({
    path: path.join(__dirname,"../.env")
})
/**
 * Deploy require $PATH variable.
 * 
 * In this project, use 'dotenv' for ENV variable. require to dotenv configuration before
 */
import { deploy } from './deploy'
// Require redis dependency
import {chatgptcommand} from "./commands"

const client: Discord.DiscordCustomClient = new Discord.DiscordCustomClient({
    intents : [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
})
// enroll command
client.commands.set(chatgptcommand.data.name,chatgptcommand);

(async () => await deploy(client))()

client.once(Events.ClientReady, info => {
    logger.info(`I'm ready! Logged in as ${info.user.tag}`)
})

/**
 * Event Emitter
 */
client.on(Events.ClientReady,() => {
    ready(client)
})

// Slash Command is interaction. Add interaction event listener
client.on(Events.InteractionCreate,(interaction) => {
    interactionCreate(client,interaction)
})
logger.info(process.env.DISCORD_API)


client.login(process.env.DISCORD_API);