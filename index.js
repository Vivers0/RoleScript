const Discord = require("discord.js"),
  client = new Discord.Client(),
  config = require("./config.json"),
  prefix = config.prefix,
  token = config.token,
  channel_get = config.channel_get,
  channel_set = config.channel_set;

client.login(token);

client.on("ready", () => {
  console.log("Ready!");
});

global.topArray = {};

client.on("message", message => {
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (cmd === prefix + "role" || cmd === prefix + "роль") {
    if(message.channel.id !== channel_get) return;
    const roles = args[0];
    const member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!args[0]) return message.channel.send("Вы не указали роль!");
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.RichEmbed().setAuthor("У вас нет прав!").setColor("RED"));
    
    message.channel.send(new Discord.RichEmbed().setAuthor("Успешно!").setColor("GREEN").setTimestamp());

    let embed = new Discord.RichEmbed()
      .setAuthor("Запрос на роль!")
      .addField("Аккаунт:", "<@" + message.author.id + ">", true)
      .addField("Ник:", message.author.username, true)
      .addField("Роль:", roles, true)
      .addField("Отправлено с канала", `<#${message.channel.id}>`)
      .addField("Команды:", `Выдать роль - [✅]\nОтказаться - [🛑]`, true)
      .setColor("GREEN")
      .setTimestamp();
    client.channels.get(channel_set).send(embed).then(async msg => {
      await msg.react("✅");
      await msg.react("❌");
      await msg.react("🇩");
      topArray[msg.id] = {
        msg_id: msg.id,
        role: roles.match(/\d+/g)[0],
        user: member.id,
        channel: msg.channel
      };

    }).catch(err => console.log(err));

    
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  let emoji = reaction.emoji.name;
  let msg_id = reaction.message.id;
  if(!topArray[msg_id] || user.bot) return;
  
  if(emoji == "✅"){
    let member = reaction.message.guild.members.find(u => u.id === topArray[msg_id].user);
    member.addRole(topArray[msg_id].role);
    topArray[msg_id].channel.send(new Discord.RichEmbed().setAuthor("Успешно!").addField(".", `Вы выдали роль <@&${topArray[msg_id].role}> Пользователю ${member}`).setColor("GREEN").setTimestamp());
  }
  if(emoji == "❌"){
    topArray[msg_id].channel.send(new Discord.RichEmbed().setAuthor("Отмена!").setTitle("Вы отменили выдачу роли!").setColor("RED").setTimestamp());
    delete topArray[msg_id];
  }
  if(emoji == "🇩"){
    topArray[msg_id].channel.fetchMessage(topArray[msg_id].msg_id).then(msg => msg.delete());
  }
})
