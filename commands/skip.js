const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioManager = require('../AudioManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    async execute(interaction){
        if(!AudioManager.getGuildQueue(interaction.guildId)){await interaction.reply({content: 'Queue is empty', ephemeral: true}); return;}
        interaction.reply({content: 'Skipped!' ,ephemeral: true});
    }
}