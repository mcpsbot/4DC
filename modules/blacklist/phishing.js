const { Message } = require('discord.js');
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
    
    const staffChan = client.channels.cache.get(process.env.STAFF_CHAN);
    const reason = 'Phishing link';

    const member = message?.member;

    const contLow = message?.content.toLowerCase();

    async function checkMessage(content) {
        let isPhishing = await sdp.checkMessage(content);

        if (isPhishing) {
            member?.timeout(86400 * 1000 * 7, `${reason}`).catch(err => console.error(`${path.basename(__filename)} There was a problem adding a timeout: `, err));

            member?.send({
                content: `${process.env.BOT_DENY} Phishing link detected. You have been timed out until a staff member can verify if this is a mistake or not. If this is a mistake, please contact a staff member`
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending a message to a user. This usually happens when the target has DMs disabled: `, err));

            setTimeout(() => { message?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err)) }, 600);

            const avatarURL = client.user.avatarURL({ format: 'png', size: 256 });

            staffChan.createWebhook(client.user.username, { avatar: avatarURL }).then(webhook => {
                webhook.send({
                    content: `<@&885919072791973898>
${message?.author} posted a link that looks like a phishing link. Please review [this message](${m?.url}) if it exists, and ban them if neccassary`,
                }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending a webhook message: `, err));

                setTimeout(() => {
                    webhook.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a webhook: `, err));
                }, 10000);
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem creating a webhook: `, err));
        }
        return isPhishing;
    }
    checkMessage(contLow);
    await sleep(300);
}