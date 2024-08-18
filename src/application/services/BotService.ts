import { Client, Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { CommandRepository } from "../../domain/repositories/CommandRepository";
import Canvas from "canvas";
import path from "path";

export class BotService {
  constructor(
    private client: Client,
    private commandRepository: CommandRepository
  ) {}

  public init() {
    this.client.once("ready", () => {
      console.log(`Connected as ${this.client.user?.tag}`);
      console.log("Servers: ");
      this.client.guilds.cache.forEach((guild) => {
        console.log(` - ${guild.name}`);
        guild.channels.cache.forEach((channel) => {
          console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
        console.log();
      });
    });

    this.client.on("messageCreate", (message: Message) =>
      this.handleMessage(message)
    );
  }

  private async handleMessage(message: Message) {
    if (message.author.bot) return;

    const prefix = process.env.PREFIX || "!";
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift()?.toLowerCase();

    switch (command) {
      case "avatar":
        await this.handleAvatarCommand(message);
        break;
      case "slam":
        await this.handleSlamCommand(message);
        break;
      case "hug":
        await this.handleHugCommand(message);
        break;
      case "punch":
        await this.handlePunchCommand(message);
        break;
      case "kiss":
        await this.handleKissCommand(message);
        break;
      case "come":
        await this.handleComeCommand(message);
        break;
      default:
        message.channel.send("Command not recognized.");
    }
  }

  private async handleAvatarCommand(message: Message) {
    const user =
      message.mentions.users.first() ||
      this.client.users.cache.find(
        (user) => user.tag === message.content.split(" ")[1]
      ) ||
      message.author;
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag })
      .setTitle("Direct Link")
      .setURL(user.displayAvatarURL({ extension: "png", size: 2048 }))
      .setColor("#275BF0")
      .setImage(user.displayAvatarURL({ extension: "png", size: 2048 }))
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  }

  private async handleSlamCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const canvas = Canvas.createCanvas(1366, 768);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage(
      path.join(__dirname, "../../assets/images/slam.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ extension: "png" }) || ""
    );
    context.rotate((-20 * Math.PI) / 180);
    context.drawImage(avatar, 550, 350, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "slam.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handleHugCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const canvas = Canvas.createCanvas(1200, 1300);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage(
      path.join(__dirname, "../../assets/images/hug.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(700, 680, 175, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ extension: "png" }) || ""
    );
    context.rotate((-40 * Math.PI) / 180);
    context.drawImage(avatar, -75, 780, 400, 400);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "hug.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handlePunchCommand(message: Message) {
    const args = message.content.split(" ");
    const target = args[1];

    // Determine the user to punch
    let user;
    if (message.mentions.users.size > 0) {
      user = message.mentions.users.first();
    } else if (this.client.users.cache.find((user) => user.tag === target)) {
      user = this.client.users.cache.find((user) => user.tag === target);
    }

    // Determine the text to use
    const text = user ? user.displayName : target;

    // Load and draw on canvas
    const canvas = Canvas.createCanvas(500, 500);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage(
      path.join(__dirname, "../../assets/images/punch.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = "60px bold sans-serif";
    context.fillStyle = "#000";
    const name = `Pukul ${text}`;
    context.fillText(
      name,
      canvas.width / 2 - context.measureText(name).width / 2,
      450
    );

    // Send the image
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "punch.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handleKissCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const canvas = Canvas.createCanvas(1366, 768);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage(
      path.join(__dirname, "../../assets/images/kiss.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ extension: "png" }) || ""
    );
    context.rotate((-10 * Math.PI) / 180);
    context.drawImage(avatar, 425, 350, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "kiss.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handleComeCommand(message: Message) {
    const mentions = message.mentions.users;
    const text = message.content
      .split(" ")
      .slice(mentions.size + 1)
      .join(" ");

    if (text === "") return;

    const canvas = Canvas.createCanvas(1366, 768);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage(
      path.join(__dirname, "../../assets/images/come.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (mentions.size > 0) {
      const users = Array.from(mentions.values());

      if (mentions.size > 2) {
        const avatarSize = 200;
        const positions = [
          { x: 250, y: 275 },
          { x: 800, y: 250 },
        ];

        for (let i = 0; i < mentions.size; i++) {
          const avatar = await Canvas.loadImage(
            users[i].displayAvatarURL({ extension: "png" })
          );

          let positionCustom = positions[i];
          if (i === 2) {
            positionCustom = positions[1];
            positionCustom.x = 800 + 100 * (i - 1);
          }

          context.drawImage(
            avatar,
            positionCustom.x,
            positionCustom.y,
            avatarSize,
            avatarSize
          );
        }
      }
      if (mentions.size === 2) {
        const avatarOne = await Canvas.loadImage(
          users[0].displayAvatarURL({ extension: "png" })
        );
        const avatarTwo = await Canvas.loadImage(
          users[1].displayAvatarURL({ extension: "png" })
        );
        context.drawImage(avatarOne, 250, 275, 200, 200);
        context.drawImage(avatarTwo, 800, 250, 200, 200);
      }
      if (mentions.size === 1) {
        const avatarOne = await Canvas.loadImage(
          users[0].displayAvatarURL({ extension: "png" })
        );
        context.drawImage(avatarOne, 800, 250, 200, 200);
      }
    }

    context.font = "60px bold sans-serif";
    context.fillStyle = "#fff";
    const name = `${text}`;
    context.fillText(
      name,
      canvas.width / 2 - context.measureText(name).width / 2,
      700
    );

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "come.png",
    });
    message.channel.send({ files: [attachment] });
  }
}
