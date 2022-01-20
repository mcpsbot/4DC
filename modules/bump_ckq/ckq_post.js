const { Message } = require('discord.js');
const mongo = require('../../mongo');
const timerSchema = require('../../schemas/timer-schema');
const blacklist = require('../../lists/blacklist');
const path = require('path');
/**
 * 
 * @param {Message} message 
 */
module.exports = async (message) => {
    if (message?.channel.id === process.env.CKQ_CHAN && !message?.author.bot) {
        for (var i in blacklist.links) {
            if (message?.content.toLowerCase().includes(blacklist.links[i].toLowerCase())) return;
        }

        const ckqChannel = message?.channel;
        const ckqRole = message?.guild.roles.cache.get(process.env.CKQ_ROLE);
        const target = message?.member;

        ckqChannel.permissionOverwrites.edit(message?.guildId, {
            SEND_MESSAGES: false,
        }).catch(err => console.error(`${path.basename(__filename)} There was a problem editing a channel's permissions: `, err));

        target?.roles?.add(ckqRole).catch(err => console.error(`${path.basename(__filename)} There was a problem adding a role: `, err));

        const myDate = new Date();
        const addTwo = myDate.setHours(myDate.getHours() + 5);
        const timestamp = addTwo;
        
        await mongo().then(async mongoose => {
            const searchFor = 'currentTime';

            await timerSchema.findOneAndUpdate({
                searchFor
            }, {
                timestamp,
                searchFor
            }, {
                upsert: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem updating a database entry: `, err));
        }).catch(err => console.error(`${path.basename(__filename)} There was a problem connecting to the database: `, err));
    }
}