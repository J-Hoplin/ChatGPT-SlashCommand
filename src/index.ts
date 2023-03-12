import path from 'path'
import {config} from 'dotenv'
import * as Discord from './classes'
import { Events, GatewayIntentBits, Collection, CommandInteraction, Interaction, ActivityType} from 'discord.js'
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
import {chatgptcommand, pingcommand} from "./commands"

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
client.commands.set(pingcommand.data.name,pingcommand);

// Deploy command route
(async () => await deploy(client))()

client.once(Events.ClientReady, info => {
    logger.info(`I'm ready! Logged in as ${info.user.tag}`)
})

/**
 * Event Emitter
 */
client.on(Events.ClientReady,() => {
    ready(client)
    client.user?.setStatus('online')
    client.user?.setPresence({
        status: 'online',
        activities: [{
            name: 'Use /ask-gpt to ask!',
        }]
    })
})

// Slash Command is interaction. Add interaction event listener
client.on(Events.InteractionCreate,(interaction) => {
    interactionCreate(client,interaction)
})

client.login(process.env.DISCORD_API);