import { OpenAI } from "openai";

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

const ChatGPT = async (
  message: string
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  const chat = await openAI.chat.completions.create({
    model: "gpt-4-1106-preview",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: "Please answer less than 2000 strings",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });
  return chat;
};

export default ChatGPT;
