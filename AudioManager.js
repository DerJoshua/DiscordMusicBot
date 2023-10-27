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
        .on('error', (err) => {console.log(`Test: ${err}`);  queue.get(guildId).songs.shift(); this.play(guildId);})
        .on('stateChange', (old, neu) => {if(!(neu.status === AudioPlayerStatus.Idle)) return; console.log(`Starting next song`);  queue.get(guildId).songs.shift(); this.play(guildId);})
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
        return song = {title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url, author: songInfo.videoDetails.author.name, icon: songInfo.videoDetails.author.thumbnails[0].url, channel_url: songInfo.videoDetails.author.user_url};
    },
    joinVoiceChannel(channelId, guildId, voiceAdapterCreator){
        const connection = joinVC({channelId: channelId, guildId: guildId, adapterCreator: voiceAdapterCreator});
        connection.on(VoiceConnectionStatus.Ready, () => {connection.subscribe(queue.get(guildId).player)});
        return connection;
    },
    addSong(guildId, song){
        queue.get(guildId).songs.push(song);
    },
    bump(guildId){
        if(queue.get(guildId).player.state.status === 'idle'){
            this.play(guildId);
        }
    },
    play(guildId){
        if (queue.get(guildId).songs.length === 0) {
            getVoiceConnection(guildId).destroy();
            queue.delete(guildId);
            return;
        }
        const player = queue.get(guildId).player;
        const audio = ytdl(queue.get(guildId).songs[0].url, {
            filter: 'audioonly',
            fmt: 'mp3',
            highWaterMark: 1 << 30,
            liveBuffer: 10000,
            dlChunkSize: 4096,
            bitrate: 128,
            quality: 'lowestaudio'
        });
        player.play(createAudioResource(audio));
    },
    skip(guildId){
        if(!queue.get(guildId)) return false;
        queue.get(guildId).player.stop();
        queue.get(guildId).songs.shift();
        this.play(guildId);
    },
    stop(guildId){
        if(getVoiceConnection(guildId)){
            getVoiceConnection(guildId).destroy();
        }
        if(queue.get(guildId)){
            queue.delete(guildId);
        }
    },
    pause(guildId){
        queue.get(guildId).player.pause();
    },
    resume(guildId){
        queue.get(guildId).player.unpause();
    }

};