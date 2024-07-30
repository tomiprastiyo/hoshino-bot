import { createDiscordClient } from "../infrastructure/discord/DiscordClient";
import { BotService } from "../application/services/BotService";
import { CommandRepository } from "../domain/repositories/CommandRepository";
import { config } from "../infrastructure/config/config";
import { keepAlive } from "../infrastructure/discord/keepAlive";

const client = createDiscordClient();
const commandRepository = new CommandRepository();
const botService = new BotService(client, commandRepository);

botService.init();

keepAlive();

client.login(config.token);
