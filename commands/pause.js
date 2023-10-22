const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioManager = require('../AudioManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the playback'),
    async execute(interaction){
        AudioManager.pause(interaction.guildId);
        interaction.reply({content: 'Paused', ephemeral: true})
    }
}