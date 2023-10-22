const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioManager = require('../AudioManager');
const { EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Get information to the current song'),
    async execute(interaction){
        const songInfo = AudioManager.getGuildQueue(interaction.guildId).songs[0];
        await interaction.channel.send({embeds: [new EmbedBuilder()
            .setTitle('Currently playing:')
            .setDescription(songInfo.title)
            .setAuthor({name: songInfo.author, iconURL: songInfo.icon, url: songInfo.channel_url})
        ]});
        
    }
}