const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioManager = require('../AudioManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the playback'),
    async execute(interaction){
        AudioManager.stop();
    }
}