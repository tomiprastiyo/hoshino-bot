import { Client, Message } from "discord.js";
import { Command } from "../../domain/entities/Command";

export class BotService {
  private client: Client;
  private commands: Command[] = [];

  constructor(client: Client) {
    this.client = client;
  }

  public addCommand(command: Command): void {
    this.commands.push(command);
  }

  public handleMessage(message: Message): void {
    this.commands.forEach((command) => {
      if (message.content.startsWith(command.trigger)) {
        command.execute(message);
      }
    });
  }
}
