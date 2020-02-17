const Discord = require("discord.js"),
  client = new Discord.Client(),
  config = require("./config.json"),
  prefix = config.prefix,
  token = config.token,
  channel_get = config.channel_get,
  channel_set = config.channel_set,
  serverStats = {
    guildID: '641325122636087316',
    memberCountID: '672058862370553876',
    voiceStatsID: '672058990913650698'
  };

client.login(token);

const acivities_list = ["Spark.org | The Star Revenge", "discord.gg/qhAq3x8"];

client.on("ready", () => {
  setInterval(() => {
    let index = Math.floor(Math.random() * acivities_list.length);
    client.user.setActivity(acivities_list[index], { type: "WATCHING" });
  }, 7000);
  console.log("Ready!");
});

const topArray = {};

client.on('guildMemberAdd', member => {
    if (member.guild.id !== serverStats.guildID) return;
    client.channels.get(serverStats.memberCountID).setName(`🌃 Игроки: ${member.guild.members.filter(m => !m.user.bot).size}`);
  });
 
  client.on('guildMemberRemove', member => {
   if (member.guild.id !== serverStats.guildID) return;
   client.channels.get(serverStats.memberCountID).setName(`🌃 Игроки: ${member.guild.memberCount}`);
  })



client.on("message", message => {
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (cmd === prefix + "role" || cmd === prefix + "роль") {
    if(message.channel.id !== channel_get) return;
    let rol;

      if(args[0] === 'Guard') rol = '641328673294909460';
      else if(args[0] === '21st') rol = '642380236331417600';
      else if(args[0] === '41st') rol = '641329067978915881';
      else if(args[0] === '104th') rol = '641328666390822922';
      else if(args[0] === 'CT') rol = '641328671252283433';
      else if(args[0] === 'DeputyCMD') rol = '672064506251182081';
      else if(args[0] === 'Commander') rol = '641326273825734656';
      else if(args[0] === 'Private_Structure') rol = '641326898122719264';
      else if(args[0] === 'Sergeant_Structure') rol = '641327171121578037';
      else if(args[0] === 'Warrant_Structure') rol = '641327455063244836';
      else if(args[0] === 'Officer_Structure') rol = '672063780217159730';
      else if(args[0] === 'Older_Structure') rol = '641327209289744384';
      else return message.channel.send("Такой роли нет!");
  


    // const member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!args[0]) return message.channel.send("Вы не указали роль!");
    // if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.RichEmbed().setAuthor("У вас нет прав!").setColor("RED"));
    
    message.channel.send(new Discord.RichEmbed().setAuthor("Ожидайте!").setColor("GREEN").setTimestamp())
    .then(m => m.delete(10000));

    let embed = new Discord.RichEmbed()
      .setAuthor("Запрос на роль!")
      .addField("Аккаунт:", "<@" + message.author.id + ">", true)
      .addField("Ник:", message.author.username, true)
      .addField("Роль:", "<@&" + rol + ">", true)
      .addField("Отправлено с канала", `<#${message.channel.id}>`)
      .addField("Команды:", `Выдать роль - [✅]\nОтказать - [🛑]\nУдалить - [🇩]`, true)
      .setColor("GREEN")
      .setFooter("Spark.org | The Star Revenge")
      .setTimestamp();
    client.channels.get(channel_set).send(embed).then(async msg => {
      await msg.react("✅");
      await msg.react("❌");
      await msg.react("🇩");
      topArray[msg.id] = {
        msg_id: msg.id,
        role: rol,
        user: message.author.id,
        channel: msg.channel,
        get: message.channel
      };

    }).catch(err => console.log(err));

    
  }
  if(cmd === prefix+"roleinfo"){
    message.channel.send(new Discord.RichEmbed()
    .setAuthor("Информация о запросе роли:","https://www.pngkey.com/png/full/43-435273_red-vector-flowing-flames-fire-flame-vector-png.png%22") 
    .setDescription(`:small_orange_diamond: Перед тем как запросить роль, ваш игровой никнейм должен состоять из:\n:small_orange_diamond: Подразделение;\n:small_orange_diamond: ID;\n:small_orange_diamond: Звание;\n:small_orange_diamond: Позывной.\n:small_orange_diamond: Например: CT 3412 RCT Fred.\n\n➤ Система запроса роли:\n= Сommands =\nЗапросить роль - !role [Подразделение/Структура/Должность]\n\n= Пример =\n!role Guard\n!role 104th\n!role Private_Structure\n!role Warrant_Structure\n\n= Units =\nCT - Клон Солдаты\n104th - 104-ый Батальон Поддержки\n41st - 41-ый Элитный Корпус\n21st - 21-ый Корпус Новы\nGuard - Корусантская Гвардия\n\n= Composition =\nPrivate_Structure - Рядовой состав\nSergeant_Structure - Сержантский состав\nWarrant_Structure - Уоррент-Офицерский состав\nOfficer_Structure - Офицерский состав\nOlder_Structure - Старший офицерский состав\n\n= Positions =\nCommander - Командир\nDeputyCMD - Заместитель Командира`)
    .setFooter("Spark.org | The Star Revenge"))
  }
  if (cmd === `${prefix}say`) {
    let say = new Discord.RichEmbed()
    .setTitle(`${message.author.username}`)
    .addField(`Написал`, `${args.splice(1).join(' ')}`)
    .setColor("#000000")
    .setFooter("Spark.org | The Star Revenge");
    message.channel.send(say);
}
if(message.content === `${prefix}rules`){
    let embed = new Discord.RichEmbed()
    .setAuthor("С Новым Годом!","https://i.imgur.com/oykXXXC.png")
    .setDescription(":pushpin: **Салют новым игрокам нашего проекта, Star Army - важный RP проект посвященный эпохе где события разворачиваются во времена между II и III эпизодами великой кино саги Джорджа Лукаса 'Звездные войны' в период войн Клонов, так что интересных событий будет предостаточно.**\n\n<:SteamLogo:636253613550993408> **Контент сервера:**\nhttps://steamcommunity.com/sharedfiles/filedetails/?id=1901789271\n\n<:DiscordLogo:642045357152403469> **Discord нашего сервера:**\nhttps://discord.gg/TfESnc3\n\n<:LightningLogo:643121700187275312> **IP сервера:**\n212.92.101.38:27215\n\n<:VKLogo:642045952567541784> **Группа VK:**\nhttps://vk.com/thestararmy\n\n<:GroupLogo:661228461498695706> **Группа Steam:**\nhttps://clck.ru/LdgwZ")
    .setThumbnail("https://i.imgur.com/L6xT2Wj.png")
    .setImage("https://i.imgur.com/sE3Nk2Q.png")
    .setColor("#FF4500")
    .setFooter("Spark.org | The Star Revenge");

    message.channel.send(embed);
}
});

client.on("messageReactionAdd", (reaction, user) => {
  let emoji = reaction.emoji.name;
  let msg_id = reaction.message.id;
  if(!topArray[msg_id] || user.bot) return;
  
  if(emoji == "✅"){
    let member = reaction.message.guild.members.find(u => u.id === topArray[msg_id].user);
    
    member.addRole(topArray[msg_id].role);
    topArray[msg_id].channel.send(new Discord.RichEmbed().setAuthor("Успешно!").addField(".", `[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor("GREEN").setTimestamp().setFooter("Spark.org | The Star Revenge"));
    topArray[msg_id].channel.fetchMessage(topArray[msg_id].msg_id).then(msg => msg.delete());
    topArray[msg_id].get.send(new Discord.RichEmbed().setAuthor("Успешно!").addField(".", `[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor("GREEN").setTimestamp().setFooter("Spark.org | The Star Revenge"));
    
  }
  if(emoji == "❌"){
    let member = reaction.message.guild.members.find(u => u.id === topArray[msg_id].user);
    topArray[msg_id].channel.send(new Discord.RichEmbed().setAuthor("Отмена!").addField(".", `[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor("RED").setTimestamp().setFooter("Spark.org | The Star Revenge"));
    topArray[msg_id].get.send(new Discord.RichEmbed().setAuthor("Отмена!").addField(".", `[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor("RED").setTimestamp().setFooter("Spark.org | The Star Revenge"))
    delete topArray[msg_id];
  }
  if(emoji == "🇩"){
    topArray[msg_id].channel.fetchMessage(topArray[msg_id].msg_id).then(msg => msg.delete());
  }
})

// Voice Update //

client.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;
  let voicetext = "🌌 В войсе: "
  let ch = client.channels.get(serverStats.voiceStatsID);
  if (newUserChannel && !oldUserChannel) {
      ch.setName(`${voicetext}${newMember.guild.members.filter(m => m.voiceChannel).size}`);
  };
  if (!newUserChannel && oldUserChannel) {
      ch.setName(`${voicetext}${newMember.guild.members.filter(m => m.voiceChannel).size}`);
  };
});