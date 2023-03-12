import Discord, { ClientOptions, Collection } from 'discord.js'
import { Command } from '../types';

class DiscordCustomClient extends Discord.Client{
    public commands: Collection<string,Command> = new Collection();
    constructor(options:ClientOptions){
        super(options)
    }
}

export default DiscordCustomClient