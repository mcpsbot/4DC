const { ContextMenuInteraction, ApplicationCommandType } = require('discord.js');
const path = require('path');

module.exports = {
    name: `leaderboards`,
    description: `View leaderboards for the server ranks, games and others`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        interaction.reply({
            content: `Leaderboards are now available by [clicking here](<https://forthecontent.xyz/>)`,
            ephemeral: true
        }).catch(err => console.error(`${path.basename(__filename)}There was a problem replying to the interaction: `, err));
    }
}