import { Client, Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { CommandRepository } from "../../domain/repositories/CommandRepository";
import { createCanvas, loadImage } from "canvas";
import canvasGif from "canvas-gif";
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
      case "slap":
        await this.handleSlapCommand(message);
        break;
      case "ditinggal":
        await this.handleAbandonedCommand(message);
        break;
      case "lord":
        await this.handleLordCommand(message);
        break;
      case "help":
        await this.handleHelpCommand(message);
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

    const canvas = createCanvas(1366, 768);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/slam.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await loadImage(
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

    const canvas = createCanvas(1200, 1300);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/hug.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(700, 680, 175, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    const avatar = await loadImage(
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
    if (!text) return;

    // Load and draw on canvas
    const canvas = createCanvas(500, 500);
    const context = canvas.getContext("2d");
    const background = await loadImage(
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

    const canvas = createCanvas(1366, 768);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/kiss.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await loadImage(
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

    // Remove the command prefix and mentions
    const cleanedContent = message.content
      .split(" ")
      .filter((word) => !mentions.has(word.replace(/[<@!>]/g, ""))) // Remove mentions
      .slice(1) // Remove the command prefix (assuming the command is the first word)
      .join(" "); // Join the remaining words back into a single string

    // Clean up extra characters and normalize spaces
    const text = cleanedContent
      .replace(/[|_]+/g, "") // Remove | and _
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim(); // Trim leading and trailing spaces

    if (text === "") return;

    const canvas = createCanvas(1366, 768);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/come.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (mentions.size > 0) {
      const users = Array.from(mentions.values());
      const avatarSize = 200;
      const positionX = 800;
      const positionY = 250;

      for (let i = 0; i < mentions.size; i++) {
        const avatar = await loadImage(
          users[i].displayAvatarURL({ extension: "png" })
        );

        let positionCustomX = positionX;
        if (i > 0) {
          positionCustomX = positionX + 100 * i;
        }

        context.drawImage(
          avatar,
          positionCustomX,
          positionY,
          avatarSize,
          avatarSize
        );
      }
    }

    const avatarAuthor = await loadImage(
      message.author.displayAvatarURL({ extension: "png" }) || ""
    );
    context.drawImage(avatarAuthor, 250, 275, 200, 200);
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

  private async handleSlapCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const canvas = createCanvas(1366, 768);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/slap.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await loadImage(
      user.displayAvatarURL({ extension: "png" }) || ""
    );
    context.rotate((5 * Math.PI) / 180);
    context.drawImage(avatar, 125, 200, 500, 500);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "slap.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handleAbandonedCommand(message: Message) {
    const text = "Ditinggal Mabar";

    canvasGif(
      path.join(__dirname, "../../assets/images/abandoned.gif"),
      (ctx, width, height, totalFrames, currentFrame) => {
        const word = `${text}`;
        ctx.font = "60px bold sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(word, width / 2 - ctx.measureText(word).width / 2, 350);
      },
      {
        fps: 60,
      }
    ).then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, {
        name: "abandoned.gif",
      });
      message.channel.send({ files: [attachment] });
    });
  }

  private async handleLordCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const canvas = createCanvas(768, 1366);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/lord.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await loadImage(
      user.displayAvatarURL({ extension: "png" }) || ""
    );
    context.drawImage(avatar, 325, 400, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "lord.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handleHelpCommand(message: Message) {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Hoshino Bot Commands")
      .setDescription("Here are the commands you can use with Hoshino Bot:")
      .addFields(
        {
          name: "Avatar",
          value: "Displays the avatar of a user",
          inline: true,
        },
        { name: "Slam", value: "Performs a slam action", inline: true },
        { name: "Hug", value: "Sends a hug", inline: true },
        { name: "Punch", value: "Powers a punch", inline: true },
        { name: "Kiss", value: "Sends a kiss", inline: true },
        { name: "Come", value: "Calls someone to come", inline: true },
        { name: "Slap", value: "Performs a slap action", inline: true },
        { name: "Ditinggal", value: "Mentions someone who left", inline: true },
        { name: "Lord", value: "Displays the lord command", inline: true },
        { name: "Help", value: "Displays this help message", inline: true }
      )
      .setFooter({ text: "Use !command for more details on each command" });

    message.channel.send({ embeds: [embed] });
  }
}
