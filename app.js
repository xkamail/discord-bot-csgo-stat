const Discord = require('discord.js')
const client = new Discord.Client()
const { GetStatBySteamId } = require('./csgo_matches')
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
const _ = require('lodash')
const RichEmbed = Discord.RichEmbed
const handleUserMessage = message => {
  // console.log(message)
  if (message.content === '#wrap') {
    message.reply('fuck you')
  }
  if (
    message.channel.name === 'csgo_stat' &&
    message.content.indexOf('#stat') === 0
  ) {
    if (message.content.length < 6) {
      return message.channel.send({
        embed: {
          color: 3447003,
          title: 'CSGO Stats! ',
          description: '#stat <steam_id>'
        }
      })
    }
    const msg = message.content
    const steam_id = msg.split(' ')[1]
    if (!/^[0-9]/.test(steam_id)) {
      const embed = new RichEmbed()
        .setTitle('ID Steam is invalid bro!')
        .setColor(0xff0000)
        .setDescription('Please, recheck your steam id.')
      return message.channel.send(embed)
    } else {
      return GetStatBySteamId(steam_id)
        .then(data => {
          const { stats, achievements, steamID } = data.playerstats
          const total_wins = _.find(stats, { name: 'total_matches_won' }).value
          const total_kills_headshot = _.find(stats, {
            name: 'total_kills_headshot'
          }).value
          const total_mvp = _.find(stats, {
            name: 'total_mvps'
          }).value
          // total_kills_ak47
          // total_shots_ak47 / total_hits_ak47
          const total_ak = _.find(stats, {
            name: 'total_kills_ak47'
          }).value
          const total_ak_accuracy =
            (_.find(stats, {
              name: 'total_hits_ak47'
            }).value /
              _.find(stats, {
                name: 'total_shots_ak47'
              }).value) *
            100
          const total_m4a1 = _.find(stats, {
            name: 'total_kills_m4a1'
          }).value
          const total_m4a1_accuracy =
            (_.find(stats, {
              name: 'total_hits_m4a1'
            }).value /
              _.find(stats, {
                name: 'total_shots_m4a1'
              }).value) *
            100

          const total_aug = _.find(stats, {
            name: 'total_kills_aug'
          }).value
          const total_aug_accuracy =
            (_.find(stats, {
              name: 'total_hits_aug'
            }).value /
              _.find(stats, {
                name: 'total_shots_aug'
              }).value) *
            100
          message.channel.send({
            embed: {
              color: 3447003,
              title: 'CSGO Stats! ',
              description: `Steam ID: ${steamID}\n
              K/D: ${stats[0].value} /${stats[1].value}\n
              Ratio: ${((stats[1].value / stats[0].value) * 100).toFixed(2)}\n
              WinRate: ${(
                (total_wins /
                  _.find(stats, {
                    name: 'total_matches_played'
                  }).value) *
                100
              ).toFixed(2)}%\n
              HeadShot: ${(
                (total_kills_headshot / stats[0].value) *
                100
              ).toFixed(2)}%\n
              MVP: ${total_mvp} times\n
              Ak: ${total_ak} Kill (${total_ak_accuracy.toFixed(2)}%)\n
              M4A1: ${total_m4a1} Kill (${total_m4a1_accuracy.toFixed(2)}%)\n
              AUGA3: ${total_aug} Kill (${total_aug_accuracy.toFixed(2)}%)\n
              `
            }
          })
        })
        .catch(error => {
          message.channel.send({
            embed: {
              color: 3447003,
              title: 'CSGO Stats!',
              description: `ดึงข้อมูลไม่ได้มันต้องมีเหิ้ยไรผิดพลาด\nเช็ค steam id ถูกป่าว\nเปิด public profile`
            }
          })
        })
    }
  }
}

client.on('message', handleUserMessage)

client.login('NjEyOTQyNDA2Mjg2OTY2ODAy.XVpuww.G27MDCQoK3sM0T8j_4mtgZKlpe4')
