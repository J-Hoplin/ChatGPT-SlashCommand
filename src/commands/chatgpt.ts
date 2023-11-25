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

const contentLength = 1950;

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
      const res = (gptResponse.choices[0].message.content as string).trim();
      // Token Usage
      const tokenUsage = gptResponse?.usage?.total_tokens;

      logger.info(
        `User: ${interaction.user.username} / Token Usage: ${tokenUsage}`
      );

      // If response is shorter than limited content length
      if (res.length < contentLength) {
        // Refresh Parent message id
        await interaction.followUp({
          content: `**Answer**
${res}        
`,
          ephemeral,
        });
        return;
      }

      // Split by code block
      const codeBlockRegex = /(```[\s\S]*?```)/;
      const splitByCodeBlock = res.split(codeBlockRegex);

      const responses = [];
      let recentResponse = "";

      splitByCodeBlock.forEach((element) => {
        if (recentResponse.length + element.length <= contentLength) {
          recentResponse += element;
        } else {
          // push response
          responses.push(recentResponse);
          // If element is less than content length
          if (element.length < contentLength) {
            recentResponse = element;
          } else {
            // If element is longer than content length

            // If element is code block
            if (codeBlockRegex.test(element)) {
              responses.push(
                "`Some of the results are missing due to long block length.`"
              );
            }
            // If it's text
            else {
              // Split by content-length and push to response array
              for (let i = 0; i < element.length; i += contentLength) {
                responses.push(element.substring(i, i + contentLength));
              }
            }

            // Initialize recent response
            recentResponse = "";
          }
        }
      });
      // If response is not empty string push remain response
      if (recentResponse) {
        responses.push(recentResponse);
      }

      for (let i = 0; i < responses.length; i++) {
        const message = responses[i];
        // In first message
        if (!i) {
          await interaction.followUp({
            content: `**Answer**
  ${message}        
  `,
            ephemeral,
          });
          continue;
        }
        await interaction.followUp({
          content: message,
          ephemeral,
        });
      }
    } catch (err) {
      logger.error(`Error Message: ${(err as Error)?.message}`);
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
