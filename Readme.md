# Chat-GPT discord command

## Prerequisite

### Installation

- Docker
- Docker Compose

### API Keys(Environment Variables)

- DISCORD_API
  - Get discord bot token in [here](https://discord.com/developers/applications).
  - Create application and go to tab `Bot`
- APPLICATION_ID
  - Get discord bot token in [here](https://discord.com/developers/applications).
  - Create application and go to tab `General Information`
- GUILD_ID
  - Make sure your discord's developer mode in active
  - Make right click on Guild's icon and click `Copy ID`
- OPENAI_API

  - Get OpenAI API key in [here](https://platform.openai.com/docs/quickstart/build-your-application)

- Make privileged gateway intent as active in [here](https://discord.com/developers/applications).(tab `Bot`)
  ![img](img/4.png)

## Start Application

---

1. git clone project

   ```bash
   git clone https://github.com/J-hoplin1/ChatGPT-SlashCommand.git
   ```

2. Write down API Keys, in [docker-compose.yml](./docker-compose.yml), `environment` field

   ```yaml

   ---
   environment:
     - DISCORD_API=
     - APPLICATION_ID=
     - GUILD_ID=
     - OPENAI_API=
   ```

3. Run deployment command

   ```bash
   yarn deploy

   (or)

   yarn deploy:su
   ```

## How to use command?

### `/ask-gpt`

1. Press `/` button and you can see command `/ask-gpt`
   ![img](./img/1.png)

2. When you use a command, you are the only one who can see the command and its answers. **Warning : These types of message and responses is temporary message. It will disappear when you exit discord**
   ![img](./img/2.png)
3. If you want to make your command public add `ispulbic` option when using command
   ![img](./img/3.png)

### `/ping`

1. Press `/` button and you can see command `/ping`
2. If you want to make your command public add `ispulbic` option when using command(same with `/ask-gpt`!)
