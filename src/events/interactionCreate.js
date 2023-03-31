const { Client, ChatInputCommandInteraction } = require('discord.js')
const {Config} = require("../config/dto")

/**
 * 
 * @param {Config} config 
 * @param {Client} client 
 * @param {ChatInputCommandInteraction} interaction 
 * @returns 
 */
module.exports = function (config, client, interaction) {
    if (interaction.user.bot) return
    const args = interaction.options.getString("input")
    const cmd = interaction.commandName
    const command = config.commands.get(cmd)
        ?? config.commands.get(config.aliases.get(cmd))
    if (command) {
        try { command.execute.call(command, config, client, interaction, args) }
        catch (error) { console.error(error) }
    }
}