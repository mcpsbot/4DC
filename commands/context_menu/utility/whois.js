const { ContextMenuInteraction, MessageEmbed } = require('discord.js');
const e = require('express');

module.exports = {
    name: `Whois`,
    description: ``,
    permission: ``,
    type: `USER`,
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const { guild } = interaction;

        const target = await guild.members.fetch(interaction.targetId);

        let acknowledgements = 'None'
        permissions = [];

        if (target.permissions.has("ADMINISTRATOR")) {
            permissions.push("Administrator");
            acknowledgements = 'Administrator';
        }
        if (target.permissions.has("BAN_MEMBERS")) {
            permissions.push("Ban Members");
        }
        if (target.permissions.has("KICK_MEMBERS")) {
            permissions.push("Kick Members");
        }
        if (target.permissions.has("MANAGE_MESSAGES")) {
            permissions.push("Manage Messages");
            acknowledgements = 'Moderator';
        }
        if (target.permissions.has("MANAGE_CHANNELS")) {
            permissions.push("Manage Channels");
        }
        if (target.permissions.has("MENTION_EVERYONE")) {
            permissions.push("Mention Everyone");
        }
        if (target.permissions.has("MANAGE_NICKNAMES")) {
            permissions.push("Manage Nicknames");
        }
        if (target.permissions.has("MANAGE_ROLES")) {
            permissions.push("Manage Roles");
            acknowledgements = 'Administrator';
        }
        if (target.permissions.has("DEAFEN_MEMBERS")) {
            permissions.push("Deafen Members");
            acknowledgements = 'Administrator';
        }
        if (target.permissions.has("MANAGE_WEBHOOKS")) {
            permissions.push("Manage Webhooks");
        }
        if (target.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            permissions.push("Manage Emojis and Stickers");
        }
        if (permissions.length == 0) {
            permissions.push("No Key Permissions Found");
        }
        if (target.id == guild.ownerId) {
            acknowledgements = 'Server Owner';
        }

        if (target.presence?.status === 'online') targetStatus = 'Online';
        if (target.presence?.status === 'idle') targetStatus = 'Idle';
        if (target.presence?.status === 'dnd') targetStatus = 'Do Not Disturb';
        if (!target.presence?.status) targetStatus = 'Offline';


        const roles = guild.members.cache.get(target.id)._roles.length;
        let roleList = `None`;
        if (roles > 0) roleList = `<@&${guild.members.cache.get(target.id)._roles.join('>, <@&')}>`;

        const response = new MessageEmbed()
            .setAuthor(`${target.user.tag}`, `${target.user.displayAvatarURL({ dynamic: true })}`)
            .setColor('RANDOM')
            .setThumbnail(`${target.user.displayAvatarURL({ dynamic: true })}`)
            .addField('Registered:', `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)
            .addField('Joined:', `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
            .addField('Status:', `${targetStatus}`, true)
            .addField('Roles:', `${roleList}`, false)
            .addField('Acknowledgements:', `${acknowledgements}`, true)
            .addField('Permissions:', `${permissions.join(`, `)}`, false)
            .setFooter(`ID: ${target.id}`)
            .setTimestamp()

        await interaction.reply({
            embeds: [response],
            ephemeral: true
        });
    }
}
