import { Client, GatewayIntentBits } from "discord.js";
import { BotService } from "../../application/services/BotService";
import { Command } from "../../domain/entities/Command";
import config from "../config/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const botService = new BotService(client);

// Example command
const helloCommand: Command = {
  trigger: "!hello",
  execute: (message) => {
    message.channel.send("Hello!");
  },
};

botService.addCommand(helloCommand);

client.login(config.discordToken);

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  botService.handleMessage(message);
});

export { botService };
