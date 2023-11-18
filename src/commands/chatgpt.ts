import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { ChatGPT } from "../app";
import { OpenAI } from "openai";
import { DiscordCustomClient } from "../classes";
import logger from "../log/index";
import { Command } from "../types";

const chatgptcommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ask-gpt")
    .setDescription("Ask to Chat-GPT")
    .addStringOption((option): SlashCommandStringOption => {
      return option
        .setName("question")
        .setDescription("Desc")
        .setRequired(true);
    })
    .addStringOption((option): SlashCommandStringOption => {
      return option
        .setName("ispublic")
        .setDescription(
          "Yes if you want to make question and response as public. Default is No"
        )
        .setRequired(false)
        .addChoices({ name: "Yes", value: "Yes" }, { name: "No", value: "No" });
    }),
  run: async (client: DiscordCustomClient, interaction: CommandInteraction) => {
    const requestUserName = interaction.user.username;
    /**
     * Use ephemral message so only requester can view his/her 's response
     * Document : https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
     */
    const message = interaction.options.get("question")!.value as string;
    const ephemeral =
      interaction.options.get("ispublic")?.value === "Yes" ? false : true;
    try {
      interaction.reply({
        content: `**Question**
${message}
        `,
        ephemeral,
      });
      // Get result
      const gptResponse = await ChatGPT(message);

      // Message
      const res = gptResponse.choices[0].message.content as string;
      // Token Usage
      const tokenUsage = gptResponse?.usage?.total_tokens;

      logger.info(
        `User: ${interaction.user.username} / Token Usage: ${tokenUsage}`
      );

      // Refresh Parent message id
      await interaction.followUp({
        content: `**Answer**
${res}        
`,
        ephemeral,
      });
    } catch (err) {
      console.error(err);
      logger.error(
        `Unexpected Behavior | User : ${interaction.user.username} / Message : ${message}`
      );
      await interaction.followUp({
        content: `Sorry \`${requestUserName}\` something went wrong while processing request😓. Please contact to Administrator`,
        ephemeral,
      });
    }
  },
};

export default chatgptcommand;
