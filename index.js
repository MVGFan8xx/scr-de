let discord = require("discord.js")
let mongodb = require("mongodb")
require("dotenv").config();
const client = new discord.Client({ intents: ["GuildMessages", "GuildMembers", "Guilds", "MessageContent", "GuildVoiceStates"], partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILDMEMBER"] });
let token = process.env.TOKEN;
let MONGOKEY = process.env.MONGOKEY;
const bilder = require("./bilder.json");
const maggus = bilder.maggus;
const rainer = bilder.rainer;
const zitate = require("./zitate.json").zitate;
const version = require("./version.json");
client.login(token)

const mongoClient = new mongodb.MongoClient(MONGOKEY);

// DATABASE Definitions
const database = mongoClient.db("SCRDE");
//const callihate = database.collection("callihate");
const banDB = database.collection("bans");

//Settings
let prefix = "-"

client.on("clientReady", async readyclient => {
  console.log(`${readyclient.user.tag} is ready`)
  try {
    await mongoClient.connect();
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("MongoClient connected")
  } catch (err) {
    console.log(err);
  }
})

client.once("clientReady", async () => {
  let activities = [
    { name: "commands", type: discord.ActivityType.Listening },
    { name: "Drachenlord", type: discord.ActivityType.Watching },
    { name: "#general", type: discord.ActivityType.Watching },
    { name: "Callis Internet Aktivitäten", type: discord.ActivityType.Watching },
    { name: "sneak peeks von Tramlink", type: discord.ActivityType.Watching },
    { name: "Markus Söder singt Sweet Caroline", type: discord.ActivityType.Listening },
    { name: "Mikas Inkompetenz", type: discord.ActivityType.Listening },
    { name: "Manfents Klo Geschichten", type: discord.ActivityType.Listening }
  ]
  let i = 0;
  client.user.setActivity(activities[i]);
  setInterval(() => {
    i = (i + 1) % activities.length;
    let act = activities[i];
    client.user.setActivity(act);
  }, 30 * 1000)
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

async function insufficientPermission(requiredPermission) {
  let embed = new discord.EmbedBuilder()
    .setTitle("Du hast keine Berechtigung diesen Befehl auszuführen")
    .setColor("Red")
    .addFields(
      {
        name: "Benötigte Berechtigung",
        value: requiredPermission
      }
    );
  return embed
}

async function errorEmbed(errTitle, errContent) {
  let embed = new discord.EmbedBuilder()
    .setTitle("Ein Fehler ist aufgetreten.")
    .setDescription(`Es ist ein Fehler aufgetreten. **${errTitle || " "}**`)
    .setColor("Red")
    .addFields(
      {
        name: "Fehler Code",
        value: errContent
      }
    );
  return embed
}

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
        if (chn.isVoiceBased()) {
          count = count + chn.members.size;
        }
      })
    });
    if (count == 0) {
      let noMic = await client.channels.fetch("1367414015289982986");
      let amountOfMsg = 0;
      let lastId = null;
      let fetched;

      do {
        fetched = await noMic.messages.fetch({ limit: 100, before: lastId });
        amountOfMsg += fetched.size;
        lastId = fetched.last()?.id;
      } while (fetched.size === 100);

      let c = 0;
      do {
        noMic.bulkDelete(100);
        c = c + 1
      } while (c <= (amountOfMsg / 100) + 1)

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
  if (message.author.bot) return;
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
        value: oldMsg.content || "*Kein Inhalt*"
      },
      {
        name: "Neuer Inhalt",
        value: newMsg.content || "*Kein Inhalt*"
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
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.author.id == "779388707153117235") return;
  const args = message.content.split(' ');
  let spamLogs = await client.channels.fetch("1367262233905725540");
  let logs = await client.channels.fetch("1367262210060980274");
  if (isCommand("rainer", message)) {
    let max = rainer.length
    message.reply({ content: rainer[Math.round(Math.random() * max)] })
  }
  if (isCommand("maggus", message)) {
    let max = maggus.length
    message.reply({ content: maggus[Math.round(Math.random() * max)] })
  }
  if (isCommand("nuke", message)) {
    message.delete();
    if (message.member.id == "424895323660484610" && parseFloat(args[1]) > 1) {
      if (parseFloat(args[1]) > 100) {
        message.channel.bulkDelete(100);
      } else {
        message.channel.bulkDelete(args[1]);
      }
      let chn = await client.channels.fetch("1391876448402407625");
      chn.send({content: "Brendon hat den nuke command genutzt in <#"+message.channel.id+">. Es wurden "+args[1]+" Nachrichten gecleart."})
    }
  }
  if (isCommand("countMsg", message)) {
    if (message.member.id == "424895323660484610") {
      let noMic = await client.channels.fetch("1367414015289982986");
      let amountOfMsg = 0;
      let lastId = null;
      let fetched;

      do {
        fetched = await noMic.messages.fetch({ limit: 100, before: lastId });
        amountOfMsg += fetched.size;
        lastId = fetched.last()?.id;
      } while (fetched.size === 100);
      message.reply({ content: `${amountOfMsg}` });
    }
  }
  if (isCommand("ban", message)) {
    let u = message.mentions.members.first() || await message.guild.members.fetch(args[1] || "424895323660484610");
    let r = args.slice(2).join(" ") || "Kein Grund angegeben";
    if (!message.member.permissions.has("BanMembers")) {
      let embed2 = new discord.EmbedBuilder()
        .setTitle("Nicht ausreichende Rechte")
        .setColor("Red")
        .setDescription("Du hast nicht die erforderlichen Rechte um diesen Command durchzuführen")
        .addFields(
          {
            name: "Benötigte Rechte",
            value: "Ban Members"
          },
          {
            name: "Ausführender Nutzer",
            value: `<@${message.member.id}>`
          }
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      message.reply({ embeds: [await insufficientPermission("Ban Members")] });
      return spamLogs.send({ embeds: [embed2] });
    }
    if (u == undefined || u == null || u.id == "424895323660484610" || u.id == message.author.id) {
      return message.reply({ embeds: [await errorEmbed("Nicht ausreichende Angaben", "Du musst auch angeben wen du bannen willst \n Dafür kannst du jemanden erwähnen oder seine ID einfügen.")] })
    }
    try {
      let caseNum = 0;
      const cursor = banDB.find({}, { projection: { _id: 1 } }).sort({ _id: 1 });
      const belegteIds = new Set();
      await cursor.forEach(doc => belegteIds.add(doc._id));
      while (belegteIds.has(caseNum)) {
        caseNum++;
        if (caseNum >= 2 ** 53) {
          throw new Error('Keine freie ID mehr verfügbar');
        }
      };
      await banDB.insertOne(
        {
          _id: caseNum,
          userId: u.id,
          reason: r,
          time: Math.round(Date.now() / 1000),
          mod: message.author.id
        }
      );

      let banEmbed = new discord.EmbedBuilder()
        .setTitle("Ban")
        .setColor("NotQuiteBlack")
        .setDescription("Es wurde jemand gebannt")
        .addFields(
          {
            name: "Gebannt wurde",
            value: `<@${u.user.id}>`,
            inline: true
          },
          {
            name: "Gebannt von",
            value: `<@${message.author.id}> (${message.author.tag})`,
            inline: true
          },
          {
            name: "Ban Nummer",
            value: caseNum.toString(),
            inline: true
          },
          {
            name: "Grund",
            value: r
          }
        )
        .setTimestamp();
      logs.send({ embeds: [banEmbed] });
      let bannedEmbed = new discord.EmbedBuilder()
        .setTitle("Du wurdest gebannt")
        .setDescription("Du wurdet aufgrund Fehlverhaltens oder anderer Gründe gebannt. Möchtest du entbannt werden, dann wende dich bitte an uns mit der unten aufgeführten Ban-Nummer.")
        .addFields(
          {
            name: "Ban Nummer",
            value: caseNum.toString(),
            inline: true
          },
          {
            name: "Grund",
            value: r
          }
        )
        .setColor("Red")
        .setTimestamp();
      try {
        await u.send({ embeds: [bannedEmbed] });
      } catch (err) {
        await message.reply({embeds: [errorEmbed(`Fehler beim Bannen von <@${u.id}>`,err)]})
      }
      await u.ban({ reason: r });
    }
    catch (err) {
      console.log(err)
    }
  }
  if (isCommand("help", message)) {
    let t = [
      "Leck Eier",
      "Leck meine Eier",
      "Frag wen anders",
      "Sie finden sicher noch einen, den es interessiert",
      "Ich bin dein Vater",
      "Erstell' doch ein Ticket mit SCR Assistance",
      "Der Wurm jagt mich",
      "-help",
      "Diese Nachricht hat 225ms gebraucht",
      "Mika ist ein Gooner vom Gooner-Verein seiner Heimatstadt",
      "Wurscht",
      "geh mal weg",
      "*atmet so heftig wie Calli im vc*",
      "Helf dir doch selber",
      "Skill issue",
      "Skill ischuh",
      "Halts maul",
      "Halt die Fresse",
      "Frag doch einfach noch mal!",
      "Nein, hier ist Patrick",
      "Nein.",
      "Ihr habt alle ein Gambling-Problem",
      "<@603610519857004544>"
    ]
    let chance = Math.random()
    let item = t[Math.round(chance * t.length)];
    if (message.author.id == "779388707153117235") {
      message.reply("Hallo Goonli");
    } else {
      message.reply(item || "Hab kein Satz gefunden");
    }
    if (chance < 0.05) {
      let chn = [
        "1367524849316134993",
        "1367406344025669703"
      ]
      let selChn = chn[Math.round(Math.random() * chn.length)] || "1367412709989159015";
      let fetchedChn = await client.channels.fetch(selChn);
      fetchedChn.send({ content: `<@${message.author.id}>` });
    }
  }
  if (isCommand("version", message)) {
    /*  if (message.author.id != "424895323660484610") {
        return message.reply("> :x: Nur Brendon darf diesen Command ausführen. Dieser ist ja auch nur für Debug da.");
      } */
    if (!message.guild) {
      return
    }
    let v = version.version;
    let commit = version.commit;
    let d = version.date;
    let embed = new discord.EmbedBuilder()
      .addFields(
        {
          name: "Version",
          value: v,
          inline: true
        },
        {
          name: "Commit",
          value: commit,
          inline: true
        },
        {
          name: "Zeitpunkt des Commits",
          value: d,
          inline: true
        }
      )
      .setColor("Blurple");
    message.reply({ embeds: [embed] })
  }
  if (isCommand("viewBan", message)) {
    // Permission view
    if (message.member.roles.cache.get("1357822938878972085") || message.member.roles.cache.get("1357827807442505748")) {
      let caseNum = args[1];
      if (!caseNum) {
        return message.reply({ embeds: [await errorEmbed("Nicht ausreichende Angaben", "Du musst auch angeben welchen Ban du anschauen willst")] })
      }
      let query = { _id: parseInt(caseNum) };
      let data = await banDB.findOne(query);
      let embed = new discord.EmbedBuilder()
      if (!data) {
        embed.setColor("DarkRed")
          .setTitle("Keine Einträge gefunden")
          .setDescription(`Ich habe keine Einträge mit der Id ${caseNum} gefunden.`)
        message.reply({ embeds: [embed] });
      } else {
        let u = data.userId;
        let r = data.reason;
        let t = data.time;
        let m = data.mod;

        embed.setColor("Green")
          .setTitle(`Ban Log für Ban #${caseNum}`)
          .addFields(
            {
              name: "Nummer",
              value: caseNum,
              inline: true
            },
            {
              name: "Nutzer",
              value: `<@${u}>`,
              inline: true
            },
            {
              name: "Nutzer Id",
              value: u,
              inline: true
            },
            {
              name: "Moderator",
              value: `<@${m}>`,
              inline: true
            },
            {
              name: "Grund",
              value: r
            },
            {
              name: "Zeitpunkt",
              value: `<t:${t}:F> (<t:${t}:R>)`,
              inline: true
            }
          )
        message.reply({ embeds: [embed] });
      }
    } else {
      return message.reply({ embeds: [await insufficientPermission("Supervisor/Manager Rolle")] })
    }
  }
  if (isCommand("zitat", message)) {
    let p = Math.round(Math.random() * zitate.length);
    message.reply(zitate[p]);
  }
})