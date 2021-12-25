const { Message, MessageEmbed } = require('discord.js');
const path = require('path');
/**
 * 
 * @param {Message} message 
 */
module.exports = (message, client, Discord) => {
    const member = message?.member;

    if (message?.channel.id === process.env.TWITCH_CHAN && !message?.content.toLowerCase().includes('twitch.tv/') && !message?.author?.bot) {
        member?.send({
            content: `${process.env.BOT_DENY} \`${message?.channel.name} is for Twitch links only\``
        }).catch(() => {
            message?.reply({
                content: `${process.env.BOT_DENY} \`This channel is for Twitch links only\``,
                deleteallowedMentions: { repliedUser: true },
                failIfNotExists: false
            }).then(msg => {
                setTimeout(() => { msg?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err)) }, 5000);
            });
        });

        setTimeout(() => { message?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err)) }, 600);
    }
}