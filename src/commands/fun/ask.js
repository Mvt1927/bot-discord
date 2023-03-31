const { Client, Message, SlashCommandBuilder, InteractionCollector } = require('discord.js')
const axios = require('axios').default
// const config = require('../../config/config.module')
const ms = require('ms')
const { Config } = require('../../config/dto')

module.exports = {
    name: 'ask',
    isSlashCommandBuilder:true,
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask ChatGPT')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                // Ensure the text will fit in an embed description, if the user chooses that option
                .setMaxLength(2000)),

    /**
     * 
     * @param {Config} config 
     * @param {Client} client 
     * @param {*} interation 
     * @param {*} args 
     * @returns 
     */
    async execute(config, client, interation, args) {
        await interation.reply(`⌛ Loading .....`)
        if (!args.length) return interation.editReply(`❎ Hãy nhập tin nhắn bạn muốn hỏi.`)
        if (config.ratelimit.has(interation.id))
            return interation.editReply('❎ Bot đang xử lý câu hỏi trước đó, xin vui lòng đợi.')
        const msg = args
        config.ratelimit.set(interation.id, true)
        const history = config.cache.get(interation.id)
        await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: !history ? [
                { role: 'user', content: msg },
            ] : [
                { role: 'user', content: history.question },
                { role: 'assistant', content: history.answer },
                { role: 'user', content: msg }
            ],
            max_tokens: 2048
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.openaikey}`
            }
        }).then(res => {
            if (!String(res.status).startsWith('2')) {
                if (String(res.status).startsWith('5'))
                    return interation.editReply('❎ Đã có lỗi xảy ra phía server OpenAI.')

                return interation.editReply('❎ Hình như token OpenAI của bạn không hợp lệ, hãy đặt lại token.')
            }

            const success = res.data.choices[0].message.content
            config.cache.del(interation.id)

            config.cache.set(interation.id, { question: msg, answer: success }, ms('5m'))
            config.ratelimit.delete(interation.id)

            return interation.editReply(success)
        }).catch(error => {
            console.error(error)
            config.ratelimit.delete(interation.id)
        })
    },
    /**
     * @arg {} config
     * @arg {Client<true>} client 
     * @arg {Message|ChatInputCommandInteraction} message
     * @arg {string[]} args
    */

    run: async (config, client, message, args) => {
        const messageLoading = await message.reply(`⌛ Loading .....`)
        if (!args.length) return messageLoading.edit(`❎ Hãy nhập tin nhắn bạn muốn hỏi.`)
        if (config.ratelimit.has(message.id))
            return messageLoading.edit('❎ Bot đang xử lý câu hỏi trước đó, xin vui lòng đợi.')
        const msg = args.join(' ')
        config.ratelimit.set(message.id, true)
        const history = config.cache.get(message.id)
        await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: !history ? [
                { role: 'user', content: msg },
            ] : [
                { role: 'user', content: history.question },
                { role: 'assistant', content: history.answer },
                { role: 'user', content: msg }
            ],
            max_tokens: 2048
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.openaikey}`
            }
        }).then(res => {
            if (!String(res.status).startsWith('2')) {
                if (String(res.status).startsWith('5'))
                    return message.reply('❎ Đã có lỗi xảy ra phía server OpenAI.')

                return message.reply('❎ Hình như token OpenAI của bạn không hợp lệ, hãy đặt lại token.')
            }

            const success = res.data.choices[0].message.content
            config.cache.del(message.id)

            config.cache.set(message.id, { question: msg, answer: success }, ms('5m'))
            config.ratelimit.delete(message.id)

            return messageLoading.edit(success)
        }).catch(error => {
            console.error(error)
            config.ratelimit.delete(message.id)
        })
    }
}
