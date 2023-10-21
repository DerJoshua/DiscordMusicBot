const { AudioPlayerStatus } = require('@discordjs/voice');
const { AudioPlayer } = require('@discordjs/voice');
const { joinVoiceChannel : joinVC, createAudioPlayer, getVoiceConnection, VoiceConnectionStatus, createAudioResource} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const queue = new Map();

module.exports = {
    getQueue(){
        return queue;
    },
    getGuildQueue(guildId){
        return queue.get(guildId);
    },
    addGuildQueue(guildId){
        var audioPlayer = createAudioPlayer()
        .on('error', () => {getNextSong();})
        .on(AudioPlayerStatus.Idle, () => getNextSong());
        const queueContruct = {
            songs: [],
            player: audioPlayer,
            volume: 5,
            playing: true
        };
        queue.set(guildId, queueContruct);
    },
    async getSongInfo(url){
        songInfo = await ytdl.getInfo(url);
        return song = {title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url,};
    },
    async joinVoiceChannel(channelId, guildId, voiceAdapterCreator){
        const connection = joinVC({channelId: channelId, guildId: guildId, adapterCreator: voiceAdapterCreator});
        connection.on(VoiceConnectionStatus.Ready, () => {connection.subscribe(queue.get(guildId).player)});
        return connection;
    },
    async addSong(guildId, song){
        console.log(queue.has(guildId))
        queue.get(guildId).songs.push(song);
    },
    async bump(guildId){
        if(queue.get(guildId).player.state.status === 'idle'){
            this.play(guildId);
        }
    },
    async play(guildId){
        if (queue.get(guildId).songs.length === 0) {
            getVoiceConnection(guildId).destroy();
            queue.delete(guild.id);
            return;
        }
        queue.get(guildId).player.play(createAudioResource(ytdl(queue.get(guildId).songs[0].url)));
        queue.get(guildId).songs.shift();
    }
};