import { Message } from "discord.js";

export interface Command {
  trigger: string;
  execute: (message: Message) => void;
}
