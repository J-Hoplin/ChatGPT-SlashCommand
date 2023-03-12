const StreamGPT = async (message: string) => {
    const { ChatGPTAPI } = await import ('chatgpt')
    const api = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API as string,
    })
    const res = await api.sendMessage(message,{
        onProgress: (partialResponse) => {
            return partialResponse.text
        }
    })
}