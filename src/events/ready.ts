import { DiscordCustomClient } from "../classes"


function ready(client: DiscordCustomClient){
    console.log(`${client.user?.username} is online`)
}

export default ready