const { Client, Message } = require('discord.js')
const {Config} = require("../config/dto")

/**
 * 
 * @param {Config} config 
 * @param {Client} client 
 * @param {Message} message 
 * @returns 
 */
module.exports = function(config, client, message) {
    console.log("🟢 Bot is Ready")
}