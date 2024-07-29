import { Command } from "../entities/Command";

export class CommandRepository {
  private commands: Command[] = [];

  public addCommand(command: Command): void {
    this.commands.push(command);
  }

  public getCommands(): Command[] {
    return this.commands;
  }
}
