const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioManager = require('../AudioManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    async execute(interaction){
        AudioManager.skip(interaction.guildId);
        interaction.reply({content: 'Skipped!' ,ephemeral: true});
    }
}