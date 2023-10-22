const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioManager = require('../AudioManager');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Get information to the current song'),
    async execute(interaction){
        if(!AudioManager.getGuildQueue(interaction.guildId)){await interaction.reply({content: 'Queue is empty', ephemeral: true}); return;}
        length = AudioManager.getGuildQueue(interaction.guildId).songs.length;
        var description = '';
        if(length > 10){length = 10}
        for(let i = 0; i<length; i++){
            var songInfo = AudioManager.getGuildQueue(interaction.guildId).songs[i];
            description = description.concat(`${songInfo.title} by ${songInfo.author}\n`);
        }
        
        await interaction.channel.send({embeds: [new EmbedBuilder()
            .setTitle('Queue:')
            .setDescription(description)
        ]});
    }
}