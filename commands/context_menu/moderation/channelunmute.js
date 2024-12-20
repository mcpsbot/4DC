const { ContextMenuInteraction, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

module.exports = {
    name: `Channel Unmute`,
    description: ``,
    cooldown: 5,
    type: ApplicationCommandType.Message,
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const { member, guild, channel } = interaction;

        const logChan = guild.channels.cache.get(process.env.LOG_CHAN);
        const fetchMsg = await channel.messages.fetch(interaction.targetId);
        const target = fetchMsg.author;

        channel.permissionOverwrites.edit(target.id, {
            SendMessages: null,
        }).catch(err => { return console.error(`${path.basename(__filename)} There was a problem editing a channel's permissions: `, err) });

        // Log to channel
        let log = new EmbedBuilder()
            .setColor("#4fe059")
            .setAuthor({ name: `${member?.user.tag}`, iconURL: member?.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**Member:** ${target?.tag} *(${target?.id})*
**Channel:** ${channel}`)
            .setFooter({ text: `Channel Unmute • ${uuidv4()}`, iconURL: 'https://www.forthecontent.xyz/images/creatorhub/unmute_icon.png' })
            .setTimestamp();

        logChan.send({
            embeds: [log]
        }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an embed: `, err));

        interaction.reply({
            content: `${process.env.BOT_CONF} ${target} was unmuted in ${channel}`,
            ephemeral: true
        }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
    }
}