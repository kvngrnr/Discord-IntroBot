const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const ids = require('../data/id.json');
const links = require('../data/links.json');

const queue = new Map();
var seek = 0;

module.exports = {
    name: 'song',
	aliases: ["play", "skip", "forceskip", "fs", "leave", "disconnect", "dc", "intro", "outro"],
    description: 'Joins and plays a video from youtube',
    async execute(message, args, cmd, client, Discord) {

		const voice_channel = message.member.voice.channel;
		if(!voice_channel) return message.channel.send("**Du musst in einem Sprachkanal sein, um diesen Befehl auszuführen, du kek** :person_facepalming:");
		const permissions = voice_channel.permissionsFor(message.client.user);
		if(!permissions.has("CONNECT")) return message.channel.send("**Du hast nicht die nötigen Berechtigungen** :pinching_hand:");
		if(!permissions.has("SPEAK")) return message.channel.send("**Du hast nicht die nötigen Berechtigungen** :pinching_hand:");

		const server_queue = queue.get(message.guild.id);

		switch(cmd) {
			case "song":
			case "play":
				if (!args.length) return message.channel.send("**Was soll ich denn spielen?** :person_shrugging:");
				let song = {};
				seek = 0;
				song = await get_song_info(args, message, song);
				await set_server_queue(server_queue, voice_channel, message, song);
				break;
			case "skip":
			case "forceskip":
			case "fs":
				skip_song(message, server_queue);
				break;
			case "leave":
			case "disconnect":
			case "dc":
		 		stop_song(message, server_queue);
				break;
		  	case "intro":
				seek = 0;
			  	intro_link = [choose_intro(message)]; //must be in array cause of get_song_info -> args array
				if(intro_link != "") {
					let intro_song = {};
					intro_song = await get_song_info(intro_link, message, intro_song);
					await set_server_queue(server_queue, voice_channel, message, intro_song);
				}
				break;
			case "outro":
				seek = 0;
				outro_link = [choose_outro(message)]; //must be in array cause of get_song_info -> args array
				if(outro_link != "") {
					let outro_song = {};
					outro_song = await get_song_info(outro_link, message, outro_song);
					await set_server_queue(server_queue, voice_channel, message, outro_song);
				}
				break;
		 }
	}
}

const get_song_info = async(args, message, song) => {
	if (ytdl.validateURL(args[0])) {
		const song_info = await ytdl.getInfo(args[0]);
		return song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
	} else {
		const video_finder = async (query) => {
			const videoResult = await ytSearch(query);
			return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
		}
		const video = await video_finder(args.join(" "));
		if(video) {
			return song = { title: video.title, url: video.url }
		} else {
			return message.channel.send("**Video nicht gefunden** :sweat:");
		}
	}
}

const set_server_queue = async(server_queue, voice_channel, message, song) => {
	if(!server_queue) {
		const queue_constructor = {
			voice_channel: voice_channel,
			text_channel: message.channel,
			connection: null,
			songs: []
		}
		queue.set(message.guild.id, queue_constructor);
		queue_constructor.songs.push(song);

		try {
			const connection = await voice_channel.join();
			queue_constructor.connection = connection;
			video_player(message.guild, queue_constructor.songs[0]);
		} catch (err) {
			queue.delete(message.guild.id);
			message.channel.send("There was an error connecting!");
		}
	} else {
		server_queue.songs.push(song);
		return message.channel.send(`**${song.title}** zur Warteschlange hinzugefügt `);
	}
}

const video_player = async(guild, song) => {
	const song_queue = queue.get(guild.id);
	if(!song) {
		song_queue.voice_channel.leave();
		queue.delete(guild.id);
		return;
	}
	const stream = ytdl(song.url, {filter: "audioonly"});
	console.log("seek: " + seek + " bei " + song.title);
	song_queue.connection.play(stream, {seek: seek, volume: 1})
	.on('finish', () => {
		song_queue.songs.shift();
		video_player(guild, song_queue.songs[0]);
	});
	await song_queue.text_channel.send(`Song läuft: **${song.title}** :notes:`)
}

const skip_song = (message, server_queue) => {
	if(!message.member.voice.channel) return message.channel.send("**Du musst in einem Sprachkanal sein, um diesen Befehl auszuführen, du kek** :person_facepalming:");
	if(!server_queue) {
		return message.channel.send("**Es laufen aktuell keine Songs** :unamused:")
	}
	message.channel.send("**Song geskippt** :ok_hand:");
	server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
	if(!message.member.voice.channel) return message.channel.send("**Du musst in einem Sprachkanal sein, um diesen Befehl auszuführen, du kek** :person_facepalming:");
	server_queue.songs = [];
	message.channel.send("**okö tschau**");
	server_queue.connection.dispatcher.end();
}

const choose_intro = (message) => {
	const id = message.author.id;
	switch(id) {
		case ids.Kevin:
			return links.Kevin_intro[Math.floor(Math.random() * links.Kevin_intro.length)];
		case ids.Michelle:
			//message.channel.send("gefunden");
			break;
		case ids.Basti:
			//message.channel.send("gefunden");
			break;
		case ids.Christian:
			random = Math.floor(Math.random() * links.Christian_intro.length);
			if(random === 0) seek = 60;
			if(random === 1) seek = 38;
			return links.Christian_intro[random];
		case ids.Moritz:
			return links.Moritz_intro[Math.floor(Math.random() * links.Moritz_intro.length)];
			break;
		case ids.Eric:
			random = Math.floor(Math.random() * links.Eric_intro.length);
			if(random === 0) seek = 20;
			return links.Eric_intro[random];
		default:
			message.channel.send("Für dich wurde noch kein Intro hinterlegt");
			console.log("Kein Intro hinterlegt für: " + id + " - " + message.author.username);
	}
}

const choose_outro = (message) => {
	const id = message.author.id;
	switch(id) {
		case ids.Kevin:
			return links.Kevin_outro[Math.floor(Math.random() * links.Kevin_outro.length)];
		case ids.Michelle:
			//message.channel.send("gefunden");
			break;
		case ids.Basti:
			return links.Basti_outro[Math.floor(Math.random() * links.Basti_outro.length)];
			break;
		case ids.Moritz:
			break;
		case ids.Christian:
			random = Math.floor(Math.random() * links.Christian_outro.length);
			if(random === 0) seek = 62;
			return links.Christian_outro[random];
		default:
			message.channel.send("Für dich wurde noch kein Outro hinterlegt");
			console.log("Kein Outro hinterlegt für: " + id + " - " + message.author.username);
	}
}
