export class Command {
  constructor(
    public name: string,
    public description: string,
    public execute: Function
  ) {}
}
