import { createDiscordClient } from "../infrastructure/discord/DiscordClient";
import { BotService } from "../application/services/BotService";
import { CommandRepository } from "../domain/repositories/CommandRepository";
import { config } from "../infrastructure/config/config";

const client = createDiscordClient();
const commandRepository = new CommandRepository();
const botService = new BotService(client, commandRepository);

botService.init();

client.login(config.token);
