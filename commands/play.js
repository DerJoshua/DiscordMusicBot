const { SlashCommandBuilder } = require('@discordjs/builders');
const AudioManager = require('../AudioManager');
const { getVoiceConnection} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song')
		.addStringOption(option =>
			option.setName('song')
				.setDescription('The song url to play back')
				.setMaxLength(50)
				.setRequired(true)),
	async execute(interaction) {
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return await interaction.reply({content: "You need to be in a voice channel to play music!", ephemeral: true});
		const permissions = voiceChannel.permissionsFor(interaction.client.user);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
			return await interaction.reply(
				{content:"I need the permissions to join and speak in your voice channel!", ephemeral: true}
			);
		}
		const song = await AudioManager.getSongInfo(interaction.options.getString("song"));
		//Create Queue and Player if not existend already
		if(!(AudioManager.getGuildQueue(interaction.guildId))){
			AudioManager.addGuildQueue(interaction.guildId);
		}
		//Connect to VC and subscribe to player if not already
		if(!getVoiceConnection(interaction.guildId)){
			voiceConnection = AudioManager.joinVoiceChannel(
				interaction.member.voice.channelId,
				interaction.guildId,
				interaction.guild.voiceAdapterCreator,
			)
		}
		// Add song to queue
		AudioManager.addSong(interaction.guildId, song);
		//Trigger if idle
		AudioManager.bump(interaction.guildId)
		return await interaction.reply(`${song.title} has been added to the queue!`);
	}
}