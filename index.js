let discord = require("discord.js")
let mongodb = require("mongodb")
const dotenv = require("dotenv").config();
const client = new discord.Client({ intents: ["GuildMessages", "GuildMembers", "Guilds", "MessageContent", "GuildVoiceStates"], partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILDMEMBER"] });
let token = process.env.TOKEN;
let MONGOKEY = process.env.MONGOKEY;
const bilder = require("./bilder.json")
const maggus = bilder.maggus;
const rainer = bilder.rainer;

client.login(token)

const mongoClient = new mongodb.MongoClient(MONGOKEY);

// DATABASE Definitions
const database = mongoClient.db("RETActivity");
const callihate = database.collection("callihate");

//Settings
let prefix = "-"

client.on("clientReady", async readyclient => {
  console.log(`${readyclient.user.tag} is ready`)
  try {
    await mongoClient.connect();
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("MongoClient connected")
  } catch (err) {
  }
})

const express = require('express')
const app = express()
const port = process.env.PORT || 1000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

client.on("voiceStateUpdate", async (oldstate, newstate) => {
  let scrdeguild = await client.guilds.fetch("1357822154200317963")
  let vcactiverole = await scrdeguild.roles.fetch("1367413944741924895")
  if (!oldstate.channelId && newstate.channelId) {
    // Beigetreten
    newstate.member.roles.add(vcactiverole)
  } else if (!newstate.channelId && oldstate.channelId) {
    newstate.member.roles.remove(vcactiverole);
    let count = 0;
    await scrdeguild.channels.fetch().then(channels => {
      channels.forEach(chn => {
        if(chn.isVoiceBased()){
          count = count + chn.members.size;
        }
      })
    });
    if(count == 0){
      let noMic = await client.channels.fetch("1367414015289982986");
      let amountOfMsg = 0;
      let lastId = null;
      let fetched;

      do {
        fetched = await noMic.messages.fetch({limit: 100, before: lastId});
        amountOfMsg += fetched.size;
        lastId = fetched.last()?.id;
      } while (fetched.size === 100);

      let c = 0;
      do {
        noMic.bulkDelete(100);
        c = c + 1
      } while (c <= (amountOfMsg/100)+1)

      console.log(amountOfMsg)
    }
  }
})
/*
client.on("guildMemberUpdate", async (oldmem, newmem) => {
  if (oldmem.roles != newmem.roles) {
    let user = oldmem.user
    let Embed = new discord.EmbedBuilder()
      .setTitle("Role Update")
      .setColor("Red")
      .setDescription("Bei irgendjemandem haben sich die Rollen geändert")
      .setTimestamp()
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "User",
          value: `<@${user.id}>`
        }
      )

    let oldroles = oldmem.roles.cache;
    let newroles = newmem.roles.cache;
    const removedRoles = oldroles.filter(role => !newroles.has(role.id));
    const addedRoles = newroles.filter(role => !oldroles.has(role.id));

    if (removedRoles.size > 0) {
      Embed.addFields(
        {
          name: "Removed roles",
          value: `- ${removedRoles.map(r => r.name).join("\n-")}`,
          inline: true
        }
      )
    }
    if (addedRoles.size > 0) {
      Embed.addFields(
        {
          name: "Added roles",
          value: `+ ${addedRoles.map(r => r.name).join("\n+")}`,
          inline: true
        }
      )
      Embed.setColor("Green")
    }
    let botdevchannel = await client.channels.fetch("1431023980864737280");
    botdevchannel.send({ embeds: [Embed] });
  }
})
*/
client.on("messageDelete", async message => {
  let spamLogs = await client.channels.fetch("1367262233905725540");
  let Embed = new discord.EmbedBuilder()
    .setTitle("Gelöschte Nachricht")
    .addFields(
      {
        name: "Autor",
        value: `<@${message.author.id}>`,
        inline: true
      },
      {
        name: "Kanal",
        value: `<#${message.channelId}>`,
        inline: true
      },
      {
        name: "Inhalt",
        value: message.content
      })
    .setTimestamp()
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    .setColor("Red")

  let ignoredChannels = ["1357822155831640257", "1367262358786801826", "1357823672190242947", "1391876448402407625", "1431023980864737280"]

  if (!ignoredChannels.find(channelId => message.channelId == channelId) && !message.content.includes("-nuke ")) {
    spamLogs.send({ embeds: [Embed] })
  }
})

client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (oldMsg.partial) {
    await oldMsg.fetch();
  };
    if (oldMsg.author.bot) return;
    let spamLogs = await client.channels.fetch("1367262233905725540");
    let Embed = new discord.EmbedBuilder()
      .setTitle("Nachricht wurde bearbeitet")
      .addFields(
        {
          name: "Autor",
          value: `<@${oldMsg.author.id}>`,
          inline: true
        },
        {
          name: "Nachricht",
          value: `https://discord.com/channels/${oldMsg.guildId}/${oldMsg.channelId}/${oldMsg.id}`,
          inline: true
        },
        {
          name: "Alter Inhalt",
          value: oldMsg.content || "Kein Inhalt"
        },
        {
          name: "Neuer Inhalt",
          value: newMsg.content || "Kein Inhalt"
        })
      .setTimestamp()
      .setThumbnail(oldMsg.author.displayAvatarURL({ dynamic: true }))
      .setColor("Green")

    let ignoredChannels = ["1357822155831640257", "1367262358786801826", "1357823672190242947", "1391876448402407625", "1431023980864737280"]

    if (!ignoredChannels.find(channelId => oldMsg.channelId == channelId)) {
      spamLogs.send({ embeds: [Embed] })
  }
})

function isCommand(command, message) {
    let msg = message.content.toLowerCase();
    let cmd = command.toLowerCase()
    return msg.startsWith(prefix + cmd)
}

client.on('messageCreate', async message => {
  if(message.author.bot) return;
  const args = message.content.split(' ');
  if(isCommand("rainer",message)){
    let max = rainer.length
    message.reply({content: rainer[Math.round(Math.random()*max)]})
  }
  if(isCommand("maggus",message)){
    let max = maggus.length
    message.reply({content: maggus[Math.round(Math.random()*max)]})
  }
  if(isCommand("nuke",message)){
    message.delete();
    if(message.member.id == "424895323660484610" && parseFloat(args[1] > 1)){
      message.channel.bulkDelete(args[1]);
    }
  }
  if(isCommand("countMsg",message)){
    if(message.member.id == "424895323660484610"){
      let noMic = await client.channels.fetch("1367414015289982986");
      let amountOfMsg = 0;
      let lastId = null;
      let fetched;

      do {
        fetched = await noMic.messages.fetch({limit: 100, before: lastId});
        amountOfMsg += fetched.size;
        lastId = fetched.last()?.id;
      } while (fetched.size === 100);
      message.reply({content: `${amountOfMsg}`});
    }
  }
})