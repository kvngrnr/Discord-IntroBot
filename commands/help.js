module.exports = {
	name: "help",
	aliases: ["commands", "command"],
	description: "Showing an Embed of the avaiable commands for this Bot",
	execute(message, args, cmd, client, Discord) {
		switch(cmd) {
			case "commands":
			case "command":
			case "help":
				const newEmbed = new Discord.MessageEmbed()
				.setColor('#d09f44')
				.setTitle('Commands des IntroBots')
				.addFields(
					{name: "#intro bzw. #outro", value: "Spielt das Intro bzw. Outro des users"},
					{name: "#song <Link/Suchwort> oder #play <Link/Suchwort>", value: "Spielt das gesuchte Video im aktuellen Sprachkanal ab"},
					{name: "#skip oder #forceskip oder #fs", value: "Überspringt das aktuelle Lied"},
					{name: "#leave oder #disconnect oder #dc", value: "Bricht die Wiedergabe ab und der Bot verlässt den Sprachkanal"},
					{name: "#help oder #commands oder #command", value: "Zeigt diese Infotafel an"}
				)
				.setTimestamp();
				message.channel.send(newEmbed);
				break;
		}
	}
}
