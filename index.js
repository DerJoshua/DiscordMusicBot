const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands('962650700767174706', '962649184094281738'),{ body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [1 << 0] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply({content: 'Pong!', ephemeral: true});
    }
    const serverQueue = queue.get(interaction.guildId);

    if (interaction.commandName === 'play') {
        execute(message, serverQueue);
        return;
    } else if (interaction.commandName === 'skip') {
        skip(message, serverQueue);
        return;
    } else if (interaction.commandName === 'stop') {
        stop(message, serverQueue);
        return;
    } else {
        await interaction.reply({content: "You need to enter a valid command!", ephemeral: true});
    }
});

client.login(config.token);