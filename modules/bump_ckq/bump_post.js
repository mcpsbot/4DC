const { Message, EmbedBuilder } = require('discord.js');
const timerSchema = require('../../schemas/misc/timer_schema');
const countingSchema = require('../../schemas/counting_game/counting_schema');
const path = require('path');
/**
 * 
 * @param {Message} message 
 */
module.exports = async (message) => {
    if (message?.channel.id === process.env.BUMP_CHAN && message?.author.id === '302050872383242240') {
        // delete the warning about regular commands
        if (message?.content.toLowerCase().includes('regular commands are being replaced')) {
            message?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err));
        }

        // replace disboard reply with our own embed and do counting save stuff
        const bumpUser = message?.interaction?.user.id;
        let savesMessage;

        if (message.embeds.length >= 1) {
            message?.channel.messages.fetch(message?.id).then(async fetched => {
                let embed = fetched?.embeds[0];

                if (embed.description.toLowerCase().includes('bump done!')) {
                    message?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err));

                    const myDate = new Date();
                    // Add two hours to the current time
                    const timestamp = myDate.setHours(myDate.getHours() + 2);

                    const searchFor = 'bumpTime';

                    message?.channel.permissionOverwrites.edit(message?.guild.id, {
                        SendMessages: false,
                    })

                    await timerSchema.updateOne({
                        searchFor
                    }, {
                        timestamp,
                        searchFor
                    }, {
                        upsert: true
                    }).catch(err => console.error(`${path.basename(__filename)} There was a problem updating a database entry: `, err));

                    // add a counting save to the user
                    const results = await countingSchema.find({ userId: bumpUser });
                    // if user doesn't have an entry yet
                    if (results.length === 0) {
                        await countingSchema.updateOne({
                            userId: bumpUser,
                            saves: 0,
                            counts: 0
                        }, {
                            userId: bumpUser,
                            saves: 0,
                            counts: 0
                        }, {
                            upsert: true
                        }).catch(err => console.error(`${path.basename(__filename)} There was a problem updating a database entry: `, err));

                        const results = await countingSchema.find({ userId: bumpUser });

                        for (const data of results) {
                            const { saves } = data;

                            if (saves < 2) {
                                await countingSchema.updateOne({
                                    userId: bumpUser
                                }, {
                                    saves: saves + 1,
                                }, {
                                    upsert: true
                                }).catch(err => console.error(`${path.basename(__filename)} There was a problem updating a database entry: `, err));

                                savesMessage = `You earned a save for the counting game and now have \`${saves + 1}/2\` saves`
                            } else {
                                savesMessage = `You already have the \`2/2\` saves for the counting game`
                            }
                        }
                    } else {
                        for (const data of results) {
                            const { saves } = data;

                            if (saves < 2) {
                                await countingSchema.updateOne({
                                    userId: bumpUser
                                }, {
                                    saves: saves + 1,
                                }, {
                                    upsert: true
                                }).catch(err => console.error(`${path.basename(__filename)} There was a problem updating a database entry: `, err));

                                savesMessage = `You earned a save for the counting game and now have \`${saves + 1}/2\` saves`
                            } else {
                                savesMessage = `You already have the \`2/2\` saves for the counting game`
                            }
                        }
                    }

                    const bumpConfirm = new EmbedBuilder()
                        .setColor('#32B9FF')
                        .setTitle(`${message?.interaction?.user.username}`)
                        .setURL('https://disboard.org/review/create/820889004055855144')
                        .setDescription(`Consider leaving an honest review of the server by [**CLICKING HERE**](https://disboard.org/review/create/820889004055855144)
        
${savesMessage}`)
                        .setImage('https://www.forthecontent.xyz/images/creatorhub/FTC_Bump.png')

                    // Fetch and delete the previous bump ping message
                    await message?.channel.messages.fetch({ limit: 3 }).then(fetched => {
                        fetched.forEach(message => {
                            if (message?.content.toLowerCase().includes('the server can be bumped again')) {
                                message?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err));
                            }
                        })
                    }).catch(err => console.error(`${path.basename(__filename)} There was a problem fetching a message: `, err));

                    // Send the confirmed bump embed
                    message?.channel.send({
                        embeds: [bumpConfirm]
                    }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an embed: `, err));
                }
            });
        }
    }

    // reminder to use the new slash commands
    if (message?.channel.id === process.env.BUMP_CHAN && message?.content.toLowerCase().includes('!d bump')) {
        message?.reply({
            content: `${process.env.BOT_DENY} That is an old command. Please use /bump now instead`,
            allowedMentions: { repliedUser: true },
            failIfNotExists: false
        }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending a message: `, err));

        setTimeout(() => {
            message?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err));
        }, 600);
    }

    // delete all regular message that aren't from bots
    if (message?.channel.id === process.env.BUMP_CHAN && !message?.author.bot) {
        message?.delete().catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err));
    }
}