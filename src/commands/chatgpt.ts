import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { DiscordCustomClient } from "../classes";
import { Command } from "../types";
import { ChatGPT } from "../app";
import v4Client from '../redis'
import logger from "../log/index";

const chatgptcommand: Command = {
    data: new SlashCommandBuilder()
    .setName('ask-gpt')
    .setDescription('Ask to Chat-GPT')
    .addStringOption((option):SlashCommandStringOption => {
        return option
        .setName("question")
        .setDescription("Desc")
        .setRequired(true)
    })
    .addStringOption((option): SlashCommandStringOption => {
        return option
        .setName("ispublic")
        .setDescription("Yes if you want to make question and response as public. Default is No")
        .setRequired(false)
        .addChoices(
            {name: 'Yes',value: 'Yes'},
            {name: 'No', value: 'No'}
        )
    }),
    run: async (client: DiscordCustomClient, interaction: CommandInteraction) => {
        const requestUser = interaction.user.id
        const requestUserName = interaction.user.username
        /**
         * Use ephemral message so only requester can view his/her 's response
         * Document : https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
         */
        const message = interaction.options.get('question')!.value as string
        const ephemeral = interaction.options.get('ispublic')?.value === 'Yes' ? false : true
        try{
            interaction.reply({
                content: `You(${requestUserName}) : ${message}`,
                ephemeral
            })
            // Get Parent Message ID of user's chat stream
            let streamID = await v4Client.get(requestUser)
            // Get result
            const res = await ChatGPT(message,streamID)
            if(!streamID){
                await v4Client.set(requestUser,res.id)
                streamID = res.id
            }
            logger.info(`User : ${interaction.user.username} / Message : ${message} / Session : ${streamID}`)
            // Refresh Parent message id
            // await v4Client.set(requestUser,res.id)
            await interaction.followUp({
                content: res.text,
                ephemeral
            });
        }catch(err){
            logger.error(`Unexpected Behavior | User : ${interaction.user.username} / Message : ${message}`)
            await interaction.followUp({
                content: `Sorry @${requestUser} something went wrong while processing request😓. Please contact to Administrator`,
                ephemeral
            })
        }
    }
}

export default chatgptcommand