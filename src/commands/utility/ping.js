const { Client, Message, SlashCommandBuilder } = require('discord.js')
const axios = require('axios').default
const ms = require('ms')

module.exports = {
    name: 'ping',
    isSlashCommandBuilder:true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies ping bot'),
    /**
     * @arg {} config
     * @arg {Client<true>} client 
     * @arg {Message|command} message
     * @arg {string[]} args
    */
   
    async execute(config, client, interaction, args) {
        const ping = Date.now() - interaction.createdTimestamp
        interaction.reply(`🚀 Ping hiện tại của bot là: ${ping}ms.`)
        console.log(`🚀 Ping hiện tại của bot là: ${ping}ms.`)
    },
    run: async (config, client, message, args) => {
        const ping = Date.now() - message.createdTimestamp
        message.reply(`🚀 Ping hiện tại của bot là: ${ping}ms.`)
        console.log(`🚀 Ping hiện tại của bot là: ${ping}ms.`)
    }
}
