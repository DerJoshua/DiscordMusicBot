const { Client, Intents, Collection, IntentsBitField } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const ytdl = require('ytdl-core')
const fs = require('node:fs');
const commandCol = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commandCol.set(command.data.name, command);
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

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = commandCol.get(interaction.commandName);
	if (!command) return;
	await command.execute(interaction);
});
const queue = new Map();

client.login(config.token);