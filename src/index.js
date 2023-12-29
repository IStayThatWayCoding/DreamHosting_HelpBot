require('dotenv').config()
const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const fs = require('fs');

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]})


const wikiPath = 'wiki.json'

try {
    var wikiContent = JSON.parse(fs.readFileSync(wikiPath, 'utf-8'));
  } catch (error) {
    console.error('Error reading or parsing wiki.json:', error);
    process.exit(1);
  }

bot.on('ready', (c) => {
    console.log(`${c.user.tag} is online`);
});

bot.on('messageCreate', (message) => {
    console.log(message)
})

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
  
    if (commandName === 'help') {
      const input = options.getString('input');
      const response = searchInWiki(input);
  
      await interaction.reply({ content: response, ephemeral: true });
    }

    if (commandName === 'hello'){
        interaction.reply('Hello!')
    }
  });

    function searchInWiki(input) {
    const category = {
      'Database': 'Database',
      'Files': 'Files',
      'Prices': 'Prices',
    }[input];

    if (category && wikiContent[category]) {
        let response = `**${category.charAt(0).toUpperCase() + category.slice(1)} Information:**\n\n`;
        const categoryContent = wikiContent[category];
    
        for (const item in categoryContent) {
          response += `**__${item}:__**\n${categoryContent[item]}\n\n`;
        }
    
        return response.trim();
      } else {
        return `Category '${input}' not found in the wiki.`;
      }
    }

bot.login(process.env.TOKEN)