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


let array = {};
let lib = {};

const acivities_list = ["Spark.org | The Star Revenge", "discord.gg/qhAq3x8"];

client.on("ready", () => {
  setInterval(() => {
    let index = Math.floor(Math.random() * acivities_list.length);
    client.user.setActivity(acivities_list[index], { type: "WATCHING" });
  }, 7000);
  console.log("Ready!");
});

client.on('guildMemberAdd', member => {
  if (member.guild.id !== serverStats.guildID) return;
  client.channels.get(serverStats.memberCountID).setName(`🌃 Игроки: ${member.guild.members.filter(m => !m.user.bot).size}`);
});

client.on('guildMemberRemove', member => {
 if (member.guild.id !== serverStats.guildID) return;
 client.channels.get(serverStats.memberCountID).setName(`🌃 Игроки: ${member.guild.memberCount}`);
})

client.on('message', async message => {
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  if (cmd === prefix + "role" || cmd === prefix + "роль") {
    if (message.channel.id != channel_get) return;
    let nickname = message.member.nickname;
    if (!nickname) return message.channel.send("Вы не указали ни одной роли в нике!")
    let nick = nickname.split(" ");

    message.channel.send(new Discord.RichEmbed().setAuthor("Ожидайте!").setColor("GREEN").setTimestamp()).then(msg => msg.delete(10000));
    message.channel.fetchMessage(message.author.lastMessage).then(msg => msg.delete(10000));

    let arr = []

    if (nick.includes("RCT") ||
        nick.includes("PVT") ||
        nick.includes("PFC") ||
        nick.includes("SPC") ||
        nick.includes("CPL")) {
      arr.push(message.guild.roles.find(r => r.name === "Рядовой состав").id)
    }
    if (nick.includes("SGT") ||
        nick.includes("SGM")) {
        arr.push(message.guild.roles.find(r => r.name === "Сержантский состав").id)
    }
    if (nick.includes("WO1") ||
        nick.includes("WO2") ||
        nick.includes("WO3")) {
        arr.push(message.guild.roles.find(r => r.name === "Уоррент-офицерский состав").id)
    }
    if (nick.includes("LT1") ||
        nick.includes("LT2")) {
        arr.push(message.guild.roles.find(r => r.name === "Офицерский состав").id)
    }
    if (nick.includes("CPT") ||
        nick.includes("MAJ") ||
        nick.includes("CC")) {
      arr.push(message.guild.roles.find(r => r.name === "Старший офицерский состав").id)
    }
    if (nick.includes("CT")) {
      arr.push(message.guild.roles.find(r => r.name === "Клон Солдат").id)
    }
    if (nick.includes("104th")) {
      arr.push(message.guild.roles.find(r => r.name === "104-й Батальон Поддержки").id)
    }
    if (nick.includes("212th")) {
      arr.push(message.guild.roles.find(r => r.name === "212-ый Штурмовой Батальон").id)
    }
    if (nick.includes("21st")) {
      arr.push(message.guild.roles.find(r => r.name === "21-й Межгалактический Корпус").id)
    }
    if (nick.includes("Guard")) {
      arr.push(message.guild.roles.find(r => r.name === "Гвардия").id)
    }
    // Next
    if (nick.includes("Omega")) {
      arr.push(message.guild.roles.find(r => r.name === "RC Omega").id)
    }
    if (nick.includes("Delta")) {
      arr.push(message.guild.roles.find(r => r.name === "RC Delta").id)
    }
    if (nick.includes("501th")) {
      arr.push(message.guild.roles.find(r => r.name === "501-ый легион").id)
    }
    if (nick.includes("ARC")) {
      arr.push(message.guild.roles.find(r => r.name === "ARC").id)
    }
    if (nick.includes("Null")) {
      arr.push(message.guild.roles.find(r => r.name === "ARC Null-class").id)
    }
    if (nick.includes("COM")) {
      arr.push(message.guild.roles.find(r => r.name === "Гвардейский Комиссариат").id)
    }

    lib[message.author.id] = {
      role: arr
    }
       
    
    let embed = new Discord.RichEmbed()
      .setAuthor("Запрос на роль")
      .setThumbnail(message.author.avatarURL)
      .addField("Аккаунт:", "<@" + message.author.id + ">", true)
      .addField("Ник:", message.author.username, true)
      .addField("Роль:",arr.map(item => "<@&"+item+">"), true)
      .addField("Отправлено с канала", `<#${message.channel.id}>`)
      .addField("Команды:", `Выдать роль - [✅]\nОтказать - [🛑]\nУдалить - [🇩]`, true)
      .setColor("GREEN")
      .setFooter("Spark.org | The Star Revenge")
      .setTimestamp();
  client.channels.get(channel_set).send(embed)
  .then(async msg => {
    await msg.react("✅");
    await msg.react("❌");
    await msg.react("🇩");
    array[msg.id] = {
        user: message.author.id,
        userID: msg.author.id,
        channel: msg.channel,
        msg_id: msg.id,
        get: message.channel
    }}).catch(err => console.log(err));
  }

  if(cmd === prefix + 'out') {
      await message.guild.member(message.author).removeRoles(message.guild.member(message.author).roles);
      await message.guild.member(message.author).addRole(message.guild.roles.get("675420554752426005"));
      message.channel.fetchMessage(message.member.lastMessageID).then(msg => msg.delete(3000));
      message.channel.send(new Discord.RichEmbed().setDescription(`<@${message.author.id}> Успешно! С вас сняты все роли!`).setColor("#FFA500").setFooter("Spark.org | The Star Revenge").setTimestamp())//.then(msg => msg.delete(3000));
      client.channels.get(channel_set).send(new Discord.RichEmbed().setDescription(`<@${message.author.id}> Успешно! С вас сняты все роли!`).setColor("#FFA500").setFooter("Spark.org | The Star Revenge").setTimestamp());
  }

  if(cmd === prefix + 'die') {
    process.exit()
  }
})


client.on("messageReactionAdd", (reaction, user) => {
  let emoji = reaction.emoji.name;
  let msg_id = reaction.message.id;
  if(!array[msg_id] || user.bot) return;
  
  if(emoji == "✅"){
    let member = reaction.message.guild.members.find(u => u.id === array[msg_id].user);
    console.log(lib[member.id].role)
    for(let i=0; i<=lib[member.id].role.length; i++){
      member.addRole(reaction.message.guild.roles.find(r => r.id === lib[member.id].role[i]));
    }

     
    array[msg_id].channel.send(new Discord.RichEmbed().setAuthor("Успешно!").setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor("GREEN").setTimestamp().setFooter("Spark.org | The Star Revenge"));
    array[msg_id].channel.fetchMessage(array[msg_id].msg_id).then(msg => msg.delete());
    array[msg_id].get.send(new Discord.RichEmbed().setAuthor("Успешно!").setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor("GREEN").setTimestamp().setFooter("Spark.org | The Star Revenge"));
    delete array[msg_id];
    delete lib[member.id];
  }
  if(emoji == "❌"){
    let member = reaction.message.guild.members.find(u => u.id === array[msg_id].user);
    array[msg_id].channel.send(new Discord.RichEmbed().setAuthor("Отмена!").setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor("RED").setTimestamp().setFooter("Spark.org | The Star Revenge"));
    array[msg_id].get.send(new Discord.RichEmbed().setAuthor("Отмена!").setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor("RED").setTimestamp().setFooter("Spark.org | The Star Revenge")).then(msg => msg.delete(5000));
    delete array[msg_id];
    delete lib[member.id];
  }
  if(emoji == "🇩"){
    array[msg_id].channel.fetchMessage(array[msg_id].msg_id).then(msg => msg.delete());
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