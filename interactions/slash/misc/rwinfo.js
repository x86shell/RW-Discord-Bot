// Deconstructing EmbedBuilder to create embeds within this command
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName("groupinfo")
		.setDescription(
			"Returns all available data on a specific ransomware group."
		)
		.addStringOption((option) =>
			option
				.setName("groupname")
				.setDescription("The name of the group to search for.")
		),

	async execute(interaction) {
		let group = interaction.options.getString("Group Name");
        const fields = [];

        

		var d = new Date();
		var now = d.toLocaleTimeString();


		fetch('https://localhost:8080/api/group/'+group)
            .then((response) => response.json())
            .then((data) => {
            if (Array.isArray(data)) {

                //collect each fqdn value from each element in the array and dynmically add it to the fields array
                // data[0]?.locations[0]?.fqdn;

                for (var i = 0; i < data.length; i++) {
                    fields.push({ name: 'Domains: ', value: data[0]?.locations[i]?.fqdn });
                }
            };
        
                // Construct the embed with the fields array
                let rwinfoEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle(group)
                .setTimestamp(now);
        
                // Add fields only if there are any
                if (fields != null) {
                rwinfoEmbed.addFields(fields);
                } else {
                rwinfoEmbed.setDescription("No data found. Did you mean x?"); // Optional: Add a message for no data
                }
    

            });
        await interaction.reply({ embeds: [rwinfoEmbed] });
	}
};

