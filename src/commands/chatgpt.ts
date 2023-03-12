import { CommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { DiscordCustomClient } from "../classes";
import { Command } from "../types";
import { ChatGPT } from "../app";
import v4Client from '../redis'

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
        /**
         * Use ephemral message so only requester can view his/her 's response
         * Document : https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
         */
        const message = interaction.options.get('question')!.value as string
        const ephemeral = interaction.options.get('ispublic')?.value === 'Yes' ? false : true
        interaction.reply({
            content: message,
            ephemeral
        })

        // Get result
        const res = await ChatGPT(message)
        console.log(res.parentMessageId)
        await interaction.followUp({
            content: res.text,
            ephemeral
        });
    }
}

export default chatgptcommand