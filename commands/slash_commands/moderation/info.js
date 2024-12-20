const { ContextMenuInteraction, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const path = require('path');

module.exports = {
	name: `info`,
	description: `Information regarding individual topics`,
	cooldown: 3,
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: `topic`,
		description: `Select the topic you want to reference`,
		type: ApplicationCommandOptionType.String,
		required: true,
		choices: [{ name: 'review', value: 'review' },
		{ name: 'connections', value: 'connections' },
        { name: 'xp', value: 'xp' },
        { name: 'premium', value: 'premium' },
        { name: 'contentshare', value: 'contentshare' }]
	},
	{
		name: `username`,
		description: `The user you want to direct the information at`,
		type: ApplicationCommandOptionType.User,
		required: true
	}],
	/**
	 * 
	 * @param {ContextMenuInteraction} interaction 
	 */
	async execute(interaction) {
		const { options } = interaction;

		const choice = options.getString('topic');
		const target = options.getUser('username');

		// REVIEW
		if (choice === 'review') {
			interaction.reply({
				content: `*Information for ${target}:*
> ${process.env.BOT_DOC} Please be more specific about what you are wanting us to review or give advice on. Asking things like "how's this video?" or "what do you think?" does not count as specific and your post will be deleted if not fixed`
			}).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
		}

		// CONNECTIONS
		if (choice === 'connections') {
			interaction.reply({
				content: `*Information for ${target}:*
> ${process.env.BOT_DOC} Linking your channels/socials to your Discord profile makes it easier for other people to find your content. To link them; in the bottom left of Discord, go to **Settings ⚙️ > Connections**`
			}).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
		}

		// XP
		if (choice === 'xp') {
			interaction.reply({
				content: `*Information for ${target}:*
> ${process.env.BOT_DOC} Every minute that you're chatting in the server, you randomly gain between 15 and 25 XP that goes towards your rank. The higher you rank, the more server features you unlock, such as, less competitive promotional channels. To avoid spamming, earning XP is limited to once a minute per user. You can check your current rank by going to <#${process.env.BOT_CHAN}> and typing \`/rank\``
			}).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
		}

		// PREMIUM
		if (choice === 'premium') {
			interaction.reply({
				content: `*Information for ${target}:*
> ${process.env.BOT_DOC} The <#${process.env.PREM_CHAN}> channel is a paid service where you can promote content that generally isn't allowed to be posted in the rest of the server. Things like Discord server invites, paid services and products and even regular social media, channels and videos. For more information [click here](<https://discord.com/channels/820889004055855144/907446635435540551/907463741174587473>) or DM ProbablyRaging`
			}).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
		}

		// CONTENT SHARE
		if (choice === 'contentshare') {
			interaction.reply({
				content: `*Information for ${target}:*
> ${process.env.BOT_DOC} You can share your content in the <#856719763187302441> channel, or in the <#859117794779987978> channel by becoming a __Server Booster__. We also have the <#878229815541497857> channel which is accessible by everyone`
			}).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
		}
	}
}