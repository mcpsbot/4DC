const inviteSchema = require('../../schemas/misc/invite_schema');
const path = require('path');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client, Discord) {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const inviteChan = client.channels.cache.get(process.env.INVITE_CHAN);
        const joinLeaveChan = client.channels.cache.get(process.env.JOINLEAVE_CHAN);

        // Joins/leaves log channel
        joinLeaveChan.send({
            content: `${process.env.BOT_JOIN} ${member} joined. There are now **${guild.memberCount}** members in the server`,
            allowedMentions: { parse: [] }
        }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending a message: `, err));

        // Invite tracker
        guild.invites.fetch().then(async invites => {
            let vanity = true;

            const results = await inviteSchema.find({ uses: { $gt: 0 } }).catch(err => console.error(`${path.basename(__filename)} There was a problem finding a database entry: `, err));
            for (const data of results) {
                const { code, userId, uses } = data;

                invites.forEach(async i => {
                    if (i.code === code && i.uses > uses) {
                        vanity = false;

                        const inviter = client.users.cache.get(userId);

                        inviteChan.send({
                            content: `${member.user.tag} was invited by ${inviter.tag} who now has **${i.uses}** invites`,
                            allowedMentions: { parse: [] },
                            failIfNotExists: false
                        }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending a message: `, err));

                        await inviteSchema.updateOne({
                            code: code
                        }, {
                            uses: i.uses
                        }, {
                            upsert: true
                        }).catch(err => console.error(`${path.basename(__filename)} There was a problem updating a database entry: `, err));
                    }
                });
            }

            if (vanity) {
                return inviteChan.send({
                    content: `${member.user.tag} joined using a vanity invite`,
                    allowedMentions: { parse: [] },
                    failIfNotExists: false
                }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending a message: `, err));
            }
        });
    }
}