const Discord = require('discord.js');
const client = new Discord.Client();

const request = require("request");
const url = "http://testfield.eu/l2r/fetch.php?id=";

const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('message', message => {
  if (message.content === '!who') {
    message.reply('bot');
  }
});

// Random Number Function
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

// Rock Paper SCISSORS Function
function rps(user) {
  let bot = randomNum(1, 4)
  user = user.toUpperCase()

  switch (bot) {
    case 1:
      bot = 'ROCK'
      break
    case 2:
      bot = 'PAPER'
      break
    case 3:
      bot = 'SCISSORS'
      break
  }

  if (user === 'ROCK') {
    if (bot === 'ROCK') return ['WTF A TIE HOW', user, bot]
    if (bot === 'PAPER') return ['HAHA I WIN YOU LOSE HAHA', user, bot]
    if (bot === 'SCISSORS') return ['WHAT HOW DID YOU WIN', user, bot]
  }

  if (user === 'PAPER') {
    if (bot === 'PAPER') return ['WTF A TIE HOW', user, bot]
    if (bot === 'SCISSORS') return ['HAHA I WIN YOU LOSE HAHA', user, bot]
    if (bot === 'ROCK') return ['WHAT HOW DID YOU WIN', user, bot]
  }

  if (user === 'SCISSORS') {
    if (bot === 'SCISSORS') return ['WTF A TIE HOW', user, bot]
    if (bot === 'ROCK') return ['HAHA I WIN YOU LOSE HAHA', user, bot]
    if (bot === 'PAPER') return ['WHAT HOW DID YOU WIN', user, bot]
  }
}

function sortByKey(array, key1, key2) {
  return array.sort(function (a, b) {
    var x = a[key1] - a[key2]; var y = b[key1] - b[key2];
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

function searchStats(nick) {

}

client.on('message', async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Rock Paper SCISSORS
  if (command === "rps") {
    let userChoice = message.content.split(' ')
    if (userChoice[1].toUpperCase() === 'ROCK' || userChoice[1].toUpperCase() === 'PAPER' || userChoice[1].toUpperCase() === 'SCISSORS') {
      let results = rps(userChoice[1])
      message.channel.sendMessage('__**' + results[0] + '**__' + '\n\n**User\'s choice: **' + results[1] + '\n**Bot\'s choice: **' + results[2])
    } else {
      message.channel.sendMessage('**ERROR: **Invalid syntax! Be sure to use "rps (rock, paper, or scissors)"')
    }
  }

  if (command === "score") {

    let fullMessage = message.content.split(' ');
    let clanID = 0;
    const nick = fullMessage[1];
    let clan = fullMessage[2];

    if (fullMessage.length >= 3) {
      clan = clan.toLowerCase();
      switch (clan) {
        case 'fargo': clanID = 4; break;
        case 'ruspower': clanID = 3; break;
        case 'rp': clanID = 3; break;
        case 'легенды': clanID = 1; break;
        case 'adclan': clanID = 2; break;
        case 'ad': clanID = 2; break;

        default:
          message.channel.send("Клан не найден. Выводится общая статистика!");
          break;
      }
    }

    request.get(url + clanID, (error, response, body) => {
      let arr = JSON.parse(body);

      arr.filter(function (el) {
        if (el.name == nick) {
          message.channel.send("**Ник**: " + el.name + " - **Фраги**: " + el.kills + " **Смерти**: " + el.deaths);
        }
      });

    });
  }

  if (command === "top") {

    let fullMessage = message.content.split(' ');
    let clanID = 0;
    let topNum = 5;
    let varCut = 3;
    let clan = fullMessage[2];

    if (typeof fullMessage[1] == 'number') {
      topNum = fullMessage[1];
    } else {
      clan = fullMessage[1];
      varCut = 2;
    }

    if (fullMessage.length >= varCut) {
      clan = clan.toLowerCase();
      switch (clan) {
        case 'fargo': clanID = 4; break;
        case 'ruspower': clanID = 3; break;
        case 'rp': clanID = 3; break;
        case 'легенды': clanID = 1; break;
        case 'adclan': clanID = 2; break;
        case 'ad': clanID = 2; break;

        default:
          message.channel.send("Клан не найден. Выводится общая статистика!");
          break;
      }
    }

    request.get(url + clanID, (error, response, body) => {
      let arr = JSON.parse(body);

      sortByKey(arr, 'kills', 'deaths');
      arr.slice(0, topNum);
      arr.filter(function (el) {
        message.channel.send("**Ник**: " + el.name + " - **Фраги**: " + el.kills + " **Смерти**: " + el.deaths);
      });

    });
  }

  if (command === "site") {
    message.channel.send("http://testfield.eu/l2r/");
  }

  if (command === "help") {
    const helpMessage =
      "\n" +
      "**Команды**:\n" +
      "!site ....................................... сайт статистики\n" +
      "!score <nick> <clan> ....... счет (в разработке)\n" +
      "!top <clan> ....... top 5 (в разработке)\n" +
      "!ping ....................................... пинг бота\n" +
      "!say <message> ................. бот повторяет\n" +
      "!rps <rock|paper|scissors> ........ камень, ножницы, бумага - игра"
    "!help ..................................... показывает этот текст";

    message.channel.send(helpMessage);
  }

  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if (command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o => { });
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }

});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
