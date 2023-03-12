const ChatGPT = async (message:string,streamID:string|null) => {
    const { ChatGPTAPI } = await import('chatgpt')
    const api = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API as string,
    })
    const res = streamID 
    ? await api.sendMessage(message,{
        parentMessageId: streamID
    })
    : await api.sendMessage(message) 
    return res
}

export default ChatGPT