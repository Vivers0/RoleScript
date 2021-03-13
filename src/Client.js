/* eslint-disable no-new */
/* eslint-disable default-case */
const { Client: DiscordClient, MessageEmbed } = require('discord.js');
const listOfRoles = require('./cfg/roles.json');

class Client {
  constructor(discordToken, clientPrefix) {
    this.token = discordToken;
    this.prefix = clientPrefix;
    this.client = new DiscordClient();
    this.listOfMembersRoles = {};
    this.infoAboutMembers = {};
  }

  start() {
    this.client.login(this.token);
    this.client.on('ready', () => console.log('Ready!'));
    this.client.on('message', (message) => this.message(message));
    this.client.on('messageReactionAdd', (reaction, user) => this.getEmojiName(reaction, user));
  }

  message(message) {
    const [cmd] = message.content.split(' ');
    if (cmd === `${this.prefix}role` || cmd === `${this.prefix}роль`) {
      if (message.channel.id !== process.env.CHANNEL_GET) return;
      const { nickname } = message.member;
      if (!nickname) return message.channel.send('Вы не указали ни одной роли в нике!');
      const nick = nickname.split(' ');
      message.channel.bulkDelete(1);
      const embed = new MessageEmbed()
        .setAuthor('Ожидайте!')
        .setColor('GREEN')
        .setTimestamp();
      message.channel.send(embed).then((msg) => msg.delete({ timeout: 3000 }));
      this.getRoleArray(nick, message);
    }
  }

  getRoleArray(nick, message) {
    const arrayWithRole = [];
    Object.keys(listOfRoles).forEach((role) => {
      for (let i = 0; i <= listOfRoles[role].length; i += 1) {
        if (nick.includes(listOfRoles[role][i])) {
          arrayWithRole.push(message.guild.roles.cache.get(String(role)));
        }
      }
    });
    this.listOfMembersRoles[message.author.id] = {
      role: arrayWithRole,
    };
    this.sendEmbed(message);
  }

  sendEmbed(message) {
    const embed = new MessageEmbed()
      .setAuthor('Запрос на роль')
      .setThumbnail(message.author.avatarURL)
      .addField('Аккаунт:', `<@${message.author.id}>`, true)
      .addField('Ник:', message.author.username, true)
      .addField('Роль:', this.listOfMembersRoles[message.author.id].role.map((item) => item), true)
      .addField('Отправлено с канала', `<#${message.channel.id}>`)
      .addField('Команды:', 'Выдать роль - [✅]\nОтказать - [🛑]\nУдалить - [🇩]', true)
      .setColor('GREEN')
      .setTimestamp();

    this.client.channels.cache.get(process.env.CHANNEL_SET).send(embed)
      .then(async (msg) => {
        await msg.react('✅');
        await msg.react('❌');
        await msg.react('🇩');
        this.infoAboutMembers[msg.id] = {
          author: message.author.id,
          userID: msg.author.id,
          channel: msg.channel,
          channelID: msg.channel.id,
          msg,
          messageID: msg.id,
          get: message.channel,
          getID: message.channel.id,
        };
      }).catch((err) => console.log(err));
  }

  async getEmojiName(reaction, user) {
    const emoji = reaction.emoji.name;
    const messageID = reaction.message.id;
    if (!this.infoAboutMembers[messageID] || user.bot) return;
    let member; let embed;
    switch (emoji) {
    case '✅':
      member = reaction.message.guild.members.cache.find((u) => {
        return u.id === this.infoAboutMembers[messageID].author;
      });
      await member.roles.add(this.listOfMembersRoles[member.id].role);
      embed = new MessageEmbed()
        .setAuthor('Успешно!')
        .setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`)
        .setColor('GREEN')
        .setTimestamp();
      this.infoAboutMembers[messageID].channel.send(embed);
      this.infoAboutMembers[messageID].msg.delete({ timeout: 0 });
      this.infoAboutMembers[messageID].get.send(embed);
      delete this.infoAboutMembers[messageID];
      break;
    case '❌':
      member = reaction.message.guild.members.cache.find((u) => {
        return u.id === this.infoAboutMembers[messageID].author;
      });
      embed = new MessageEmbed()
        .setAuthor('Отмена!')
        .setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`)
        .setColor('RED')
        .setTimestamp();
      this.client.channels.cache.get(this.infoAboutMembers[messageID].channelID).send(embed);
      this.infoAboutMembers[messageID].msg.delete({ timeout: 0 });
      this.client.channels.cache.get(this.infoAboutMembers[messageID].getID).send(embed);
      delete this.infoAboutMembers[messageID];
      break;
    case '🇩':
      this.infoAboutMembers[messageID].msg.delete({ timeout: 0 });
      delete this.infoAboutMembers[messageID];
      break;
    }
  }
}

module.exports = { Client };
