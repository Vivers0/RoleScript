const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const { prefix, token, channelGet, channelSet } = require('./cfg/config.json');
const rolesList = require('./cfg/roles.json');

client.on('ready', () => console.log('READY!'));
const lib = {};
const list = {};
client.on('message', (message) => {
  const cmd = message.content.split(' ')[0];

  if (cmd === `${prefix}role` || cmd === `${prefix}роль`) {
    if (message.channel.id !== channelGet) return;
    const { nickname } = message.member;
    if (!nickname) return message.channel.send('Вы не указали ни одной роли в нике!');
    const nick = nickname.split(' ');
    message.channel.bulkDelete(1);
    message.channel.send(new MessageEmbed().setAuthor('Ожидайте!').setColor('GREEN').setTimestamp()).then((msg) => msg.delete({ timeout: 3000 }));

    getRoleArray(nick, message);
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  getEmojiName(reaction, user);
});

async function getRoleArray(nick, message) {
  const arrayWithRole = [];
  Object.keys(rolesList).forEach((role) => {
    for (let i = 0; i <= rolesList[role].length; i += 1) {
      if (nick.includes(rolesList[role][i])) {
        arrayWithRole.push(message.guild.roles.cache.get(String(role)));
      }
    }
  });

  lib[message.author.id] = {
    role: arrayWithRole,
  };
  createEmbed(message);
}

function createEmbed(message) {
  const embed = new MessageEmbed()
    .setAuthor('Запрос на роль')
    .setThumbnail(message.author.avatarURL)
    .addField('Аккаунт:', `<@${message.author.id}>`, true)
    .addField('Ник:', message.author.username, true)
    .addField('Роль:', lib[message.author.id].role.map((item) => item), true)
    .addField('Отправлено с канала', `<#${message.channel.id}>`)
    .addField('Команды:', 'Выдать роль - [✅]\nОтказать - [🛑]\nУдалить - [🇩]', true)
    .setColor('GREEN')
    .setFooter('The Star Revenge')
    .setTimestamp();

  client.channels.cache.get(channelSet).send(embed)
    .then(async (msg) => {
      await msg.react('✅');
      await msg.react('❌');
      await msg.react('🇩');
      list[msg.id] = {
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

async function getEmojiName(reaction, user) {
  const emoji = reaction.emoji.name;
  const messageID = reaction.message.id;

  if (!list[messageID] || user.bot) return;

  if (emoji === '✅') {
    // eslint-disable-next-line max-len
    const member = reaction.message.guild.members.cache.find((u) => u.id === list[messageID].author);
    await member.roles.add(lib[member.id].role);

    list[messageID].channel.send(new MessageEmbed().setAuthor('Успешно!').setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor('GREEN')
      .setTimestamp()
      .setFooter('The Star Revenge'));
    list[messageID].msg.delete({ timeout: 0 });
    list[messageID].get.send(new MessageEmbed().setAuthor('Успешно!').setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor('GREEN')
      .setTimestamp()
      .setFooter('The Star Revenge'));
    delete list[messageID];
  }

  if (emoji === '❌') {
    // eslint-disable-next-line max-len
    const member = reaction.message.guild.members.cache.find((u) => u.id === list[messageID].author);
    client.channels.cache.get(list[messageID].channelID).send(new MessageEmbed().setAuthor('Отмена!').setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor('RED')
      .setTimestamp()
      .setFooter('The Star Revenge'));
    list[messageID].msg.delete({ timeout: 0 });
    client.channels.cache.get(list[messageID].getID).send(new MessageEmbed().setAuthor('Отмена!').setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor('RED')
      .setTimestamp()
      .setFooter('The Star Revenge'));
    delete list[messageID];
  }

  if (emoji === '🇩') {
    list[messageID].msg.delete({ timeout: 0 });
    delete list[messageID];
  }
}

client.login(token);
