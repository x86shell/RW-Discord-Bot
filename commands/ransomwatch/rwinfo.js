// Deconstructing prefix from config file to use in help command
const { prefix } = require("./../../config.json");

// Deconstructing EmbedBuilder to create embeds within this command
const { EmbedBuilder, ChannelType, Embed } = require("discord.js");

/**
 * @type {import('../../typings').LegacyCommand}
 */
module.exports = {
	name: "rwinfo",
	description: "Returns the groups Tor shame site (If available)",
	usage: "[Group Name]",

	execute(message, args) {
		const { commands } = message.client;
        const fields = [];

        

		var d = new Date();
		var now = d.toLocaleTimeString();


		fetch('https://eye.intelfeed.sh/api/group/'+args)
            .then((response) => response.json())
            .then((data) => {
            if (Array.isArray(data)) {
                
                const site = data[0]?.locations[0]?.fqdn;

                fields.push(
                    { name: "URL: ", value: site },
                  );

            };
        
                // Construct the embed with the fields array
                let rwinfoEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("TOR site of "+args)
                .setTimestamp(Date.now());
        
                // Add fields only if there are any
                if (fields != null) {
                rwinfoEmbed.addFields(fields);
                } else {
                rwinfoEmbed.setDescription("No data found."); // Optional: Add a message for no data
                }
        
                // Send the single embed to the channel
                message.channel.send({ embeds: [rwinfoEmbed] });

            }).catch((error) => {
                console.error('Error fetching data:', error);
                message.channel.send('Error fetching data from the API.');
            });
	  
	}
};


