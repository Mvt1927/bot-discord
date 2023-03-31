const { Client, Message } = require('discord.js')
const {Config} = require("../config/dto")

/**
 * 
 * @param {Config} config 
 * @param {Client} client 
 * @param {Message} message 
 * @returns 
 */
module.exports = function (config, client, message) {
    if (message.author.bot) return
    if (!message.content.startsWith(config.prefix)) return
    const args = message.content.slice(config.prefix.length).trim().split(/\s+/g)
    const cmd = args.shift().toLowerCase()
    const command = config.commands.get(cmd)
        ?? config.commands.get(config.aliases.get(cmd))
    if (command) {
        try { command.run.call(command, config, client, message, args) }
        catch (error) { console.error(error) }
    }
}