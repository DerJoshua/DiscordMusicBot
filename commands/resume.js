const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioManager = require('../AudioManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the playback'),
    async execute(interaction){
        AudioManager.resume(interaction.guildId);
        interaction.reply({content: 'Resumed', ephemeral: true})
    }
}