module.exports = {
	name: "serverinfo",
	aliases: ["si", "sinfo", "info"],
	description: "displaying basic infos of the Discord server",
	execute(message, args, cmd, client, Discord) {
		const newEmbed = new Discord.MessageEmbed()
		.setColor('#28c3cd')
		.setTitle('Serverinfo')
		.addFields(
			{name: "Name des Servers", value: message.guild.name},
			{name: "Anzahl der Mitglieder", value: message.guild.memberCount}
		)
		.setTimestamp();
		message.channel.send(newEmbed);
	}
}
