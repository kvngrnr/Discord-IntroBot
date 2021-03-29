const Discord = require('discord.js');

// Initialize Discord client
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

// setting up command files
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

["command_handler", "event_handler"].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
})

client.login("ODIxNzY3NDQ0MDQwNTE1NTk0.YFIgkg.OMCpyVDnpFyhKywDQDzFoqaShS8");
