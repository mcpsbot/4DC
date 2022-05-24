const { Message, MessageEmbed } = require('discord.js');
const { logToDatabase } = require('../dashboard/log_to_database');
const sdp = require('stop-discord-phishing');
const sleep = require("timers/promises").setTimeout;
const path = require('path');
/**
 * @param {Message} message 
 */
module.exports = async (message, client) => {
    /**
     * This blacklist focuses on strict blacklisting in all channels for known phishing links
     */
    if (message?.author.id === process.env.OWNER_ID || message?.deleted || message?.author.bot) return;

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const blChan = client.channels.cache.get(process.env.BL_CHAN);
    const staffChan = client.channels.cache.get(process.env.STAFF_CHAN);
    const reason = 'Phishing Link';
    const timestamp = new Date().getTime();

    const member = message?.member;

    const contLow = message?.content.toLowerCase();

    async function checkMessage(content) {
        let isPhishing = await sdp.checkMessage(content);

        if (isPhishing) {
            member?.timeout(86400 * 1000 * 7, 'Nitro scam link').catch(err => console.error(`${path.basename(__filename)} There was a problem adding a timeout: `, err));

            member?.send({
                content: `${process.env.BOT_DENY} \`Nitro scam link detected. You have been timed out until a staff member can verify if this is a mistake or not. If this is a mistake, please contact a staff member\``
            }).catch(() => {
                message?.reply({
                    content: `${process.env.BOT_DENY} \`Nitro scam link detected. You have been timed out until a staff member can verify if this is a mistake or not. If this is a mistake, please contact a staff member\``,
                    allowedMentions: { repliedUser: true },
                    failIfNotExists: false
                }).catch(err => {
                    console.error(`${path.basename(__filename)} There was a problem sending a message: `, err);
                }).then(msg => {
                    setTimeout(() => { msg?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err)) }, 10000);
                });
            });

            setTimeout(() => { message?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err)) }, 600);

            let msgContent = message?.content || ` `;
            if (message?.content.length > 1000) msgContent = message?.content.slice(0, 1000) + '...' || ` `;

            const blacklistEmbed = new MessageEmbed()
                .setAuthor({ name: `${message?.author?.tag}'s message was deleted`, iconURL: message?.author?.displayAvatarURL({ dynamic: true }) })
                .setColor('#E04F5F')
                .addField(`Author`, `<@${message?.author?.id}>`, true)
                .addField(`Channel`, `${message?.channel}`, true)
                .addField(`Reason`, `${reason}`, true)
                .addField(`Message`, `\`\`\`${msgContent}\`\`\``)
                .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setTimestamp()

            blChan.send({
                embeds: [blacklistEmbed]
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending a log: `, err)).then(m => {
                const avatarURL = client.user.avatarURL({ format: 'png', size: 256 });

                staffChan.createWebhook(client.user.username, { avatar: avatarURL }).then(webhook => {
                    webhook.send({
                        content: `<@&885919072791973898>
${message?.author} posted a link that looks like a Discord nitro scam/virus. Please review [this message](${m?.url}) if it exists, and ban them if neccassary`,
                    }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending a webhook message: `, err));

                    setTimeout(() => {
                        webhook.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a webhook: `, err));
                    }, 10000);
                }).catch(err => console.error(`${path.basename(__filename)} There was a problem creating a webhook: `, err));
            });

            logToDatabase(message?.author?.id, message?.author?.tag, message?.channel.name, reason, msgContent, timestamp, reason);
        }

        return isPhishing;
    }

    checkMessage(contLow);
    await sleep(300);
}