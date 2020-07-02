const Discord = require(`discord.js`);
const client = new Discord.Client();
const { token } = require(`./config.json`);
const fs = require(`fs`);
const { REPL_MODE_SLOPPY } = require("repl");
const prefix = `d!`;
client.commands = new Discord.Collection();
const commandfiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`))
for(const file of commandfiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once(`ready`, () => {
    console.log(`Bot Initiated`);
});

client.on(`message`, message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const nickname = message.member.displayName
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === `ping`){
        client.commands.get(`ping`).execute(message, args);
    } else if (command === `new`){
        if (message.content.endsWith(`new`)){
            message.delete()
            const newhelp = new Discord.MessageEmbed()
                .setTitle(`d!new Help`)
                .setDescription(`Command to create new post. Current arguements:
                TurnipPrices - d!new TurnipPrices Price yes/no(Multiple Trips) yes/no(Nooks Cranny shopping) Dodocode`)
            message.channel.send(newhelp)
            } else if (args[0] === `TurnipPrices`){
                message.delete()
                const tpdodo = args[4]
                const tpembed = new Discord.MessageEmbed()
                        .setTitle(`${args[0]}`)
                        .addFields(
                            {name: `Host`, value: `${nickname}`},
                            {name: `Price`, value: `${args[1]}`},
                            {name: `Multiple trips`, value: `${args[2]}`},
                            {name: `Nooks Cranny`, value: `${args[3]}`},
                        );
                    client.channels.cache.get(`728033869609041950`).send(tpembed).then(embedMessage => {
                        embedMessage.react(`✈️`);

                        client.on(`messageReactionAdd`, (reaction, user) => {
                            if (reaction.emoji.name === "✈️") {
                            if (user.bot) return;
                                const tpuid = user.id
                                console.log(user.id);
                                user.send(`This is your Dodo code: ${tpdodo}. Travel safe.`)
                            }
                        })

                        });
            }            
        }           
})

client.login(token);