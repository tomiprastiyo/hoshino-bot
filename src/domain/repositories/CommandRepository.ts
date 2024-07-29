import { Command } from "../entities/Command";

export class CommandRepository {
  private commands: Map<string, Command> = new Map();

  public addCommand(command: Command) {
    this.commands.set(command.name, command);
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  public getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }
}
