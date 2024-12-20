const path = require('path');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client, Discord) {
        if (oldMessage?.author?.bot || oldMessage?.channel.id === process.env.TEST_CHAN) return;

        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const logChan = client.channels.cache.get(process.env.MSGLOG_CHAN);

        let original = oldMessage?.content?.slice(0, 1000) + (oldMessage?.content?.length > 1000 ? '...' : '');
        let edited = newMessage?.content?.slice(0, 1000) + (newMessage?.content?.length > 1000 ? '...' : '');

        if (oldMessage?.cleanContent !== newMessage?.cleanContent) {
            let log = new Discord.EmbedBuilder()
                .setColor('#FF9E00')
                .setAuthor({ name: `${oldMessage?.author?.tag}`, iconURL: oldMessage?.author?.displayAvatarURL({ dynamic: true }) })
                .setDescription(`[View Message](${newMessage?.url})`)
                .addFields({ name: `Author`, value: `${oldMessage?.author}`, inline: true },
                    { name: `Channel`, value: `${oldMessage?.channel}`, inline: true },
                    { name: `Old Message`, value: `\`\`\`${original}\`\`\``, inline: false },
                    { name: `New Message`, value: `\`\`\`${edited}\`\`\``, inline: false })
                .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setTimestamp()

            logChan.send({
                embeds: [log]
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an embed: `, err));
        }

        // If a user edits their message in the counting game, delete their message and send the current number
        if (newMessage?.channel.id === process.env.COUNT_CHAN && !newMessage.author.bot) {
            const containsNumbers = /\d/.test(newMessage.content);
            if (!containsNumbers) return;
            newMessage.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err));
        }

        // If a user edits their message in the counting game, delete their message and send the current number
        if (newMessage?.channel.id === process.env.LL_CHAN && !newMessage.author.bot) {
            if (newMessage.content.startsWith('>')) return;
            newMessage.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err));
        }
    }
}