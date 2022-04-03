const Discord = require('discord.js');
require('dotenv').config();

// Initialize Discord client
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

var http = require('http');  
http.createServer(function (req, res) {   
  res.write("I'm alive");   
  res.end(); 
}).listen(8080);

client.on('ready', () => {
  console.log('Your Bot is now Online.')
  let activities = [`deine Musik`, `deine Lieblingssongs`, `dein Intro`],i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %  activities.length]}`, {type:"STREAMING",url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}), 60000)
})

// setting up command files
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

["command_handler", "event_handler"].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.BOT_TOKEN);
