import { Client, Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { createCanvas, loadImage } from "canvas";
import canvasGif from "canvas-gif";
import path from "path";

export class BotService {
  constructor(private client: Client) {}

  public init() {
    this.client.once("ready", () => {
      if (!this.client.user) return;

      console.log(`Connected as ${this.client.user.tag}`);
      console.log("Servers:");

      this.client.guilds.cache.forEach((guild) => {
        console.log(` - ${guild.name}`);

        guild.channels.cache.forEach(({ name, type, id }) => {
          console.log(`   -- ${name} (${type}) - ${id}`);
        });

        console.log(); // New line after each guild
      });
    });

    this.client.on("messageCreate", this.handleMessage.bind(this));
  }

  private commandHandlers: {
    [key: string]: (message: Message) => Promise<void>;
  } = {
    avatar: this.handleAvatarCommand.bind(this),
    slam: this.handleSlamCommand.bind(this),
    hug: this.handleHugCommand.bind(this),
    punch: this.handlePunchCommand.bind(this),
    kiss: this.handleKissCommand.bind(this),
    come: this.handleComeCommand.bind(this),
    slap: this.handleSlapCommand.bind(this),
    ditinggal: this.handleAbandonedCommand.bind(this),
    lord: this.handleLordCommand.bind(this),
    diajak: this.handleInvitedCommand.bind(this),
    whenya: this.handleWhenYaCommand.bind(this),
    gmw: this.handleNopeCommand.bind(this),
    lick: this.handleLickCommand.bind(this),
    hitam: this.handleBlackCommand.bind(this),
    pagi: this.handleMorningCommand.bind(this),
    siang: this.handleAfternoonCommand.bind(this),
    malam: this.handleNightCommand.bind(this),
    makan: this.handleEatCommand.bind(this),
    help: this.handleHelpCommand.bind(this),
  };

  private async handleMessage(message: Message) {
    if (
      message.author.bot ||
      !message.content.startsWith(process.env.PREFIX || "!")
    )
      return;

    const [command] = message.content
      .slice((process.env.PREFIX || "!").length)
      .trim()
      .split(/\s+/);
    const handler = this.commandHandlers[command?.toLowerCase() || ""];

    if (handler) {
      await handler(message);
    } else {
      message.channel.send("Command not recognized.");
    }
  }

  private async handleAvatarCommand(message: Message) {
    const [_, mentionedUser] = message.content.split(/\s+/); // Retrieve the second argument after the command
    const user =
      message.mentions.users.first() ||
      this.client.users.cache.find((user) => user.tag === mentionedUser) ||
      message.author;

    const avatar =
      message.guild?.members.cache
        .get(user.id)
        ?.displayAvatarURL({ extension: "png", size: 2048 }) ||
      user.displayAvatarURL({ extension: "png", size: 2048 });

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag })
      .setTitle("Direct Link")
      .setURL(avatar)
      .setColor("#275BF0")
      .setImage(avatar)
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
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
      message.guild?.members.cache
        .get(user.id)
        ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" }) ||
        ""
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

    // Randomize the background
    const randomImage = Math.floor(Math.random() * 2) + 1;

    const avatar = await loadImage(
      message.guild?.members.cache
        .get(user.id)
        ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" }) ||
        ""
    );

    switch (randomImage) {
      case 1:
        const background = await loadImage(
          path.join(__dirname, `../../assets/images/hug/${randomImage}.jpg`)
        );

        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(700, 680, 175, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.rotate((-40 * Math.PI) / 180);
        context.drawImage(avatar, -75, 780, 400, 400);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
          name: "hug.png",
        });
        message.channel.send({ files: [attachment] });
        break;
      case 2:
        canvasGif(
          path.join(__dirname, `../../assets/images/hug/${randomImage}.gif`),
          (ctx) => {
            ctx.beginPath();
            ctx.rotate((-40 * Math.PI) / 180);
            ctx.drawImage(avatar as any, -20, 150, 65, 65);
          },
          {
            fps: 20,
          }
        ).then((buffer) => {
          const attachment = new AttachmentBuilder(buffer, {
            name: "nope.gif",
          });
          message.channel.send({ files: [attachment] });
        });
        break;
      default:
        break;
    }
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

    // Randomize the background
    const randomImage = Math.floor(Math.random() * 2) + 1;

    const background = await loadImage(
      path.join(__dirname, `../../assets/images/kiss/${randomImage}.jpg`)
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await loadImage(
      message.guild?.members.cache
        .get(user.id)
        ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" }) ||
        ""
    );

    switch (randomImage) {
      case 1:
        context.rotate((-10 * Math.PI) / 180);
        context.drawImage(avatar, 425, 350, 200, 200);
        break;
      case 2:
        context.drawImage(avatar, 425, 100, 200, 200);
        break;
      default:
        break;
    }

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
          message.guild?.members.cache
            .get(users[i].id)
            ?.displayAvatarURL({ extension: "png" }) ||
            users[i].displayAvatarURL({ extension: "png" }) ||
            ""
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
      message.guild?.members.cache
        .get(message.author.id)
        ?.displayAvatarURL({ extension: "png", size: 2048 }) ||
        message.author.displayAvatarURL({ extension: "png", size: 2048 }) ||
        ""
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
      message.guild?.members.cache
        .get(user.id)
        ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" }) ||
        ""
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
      (ctx, width) => {
        const word = `${text}`;
        ctx.font = "60px bold sans-serif";

        // Set the fill style for the text color
        ctx.fillStyle = "#fff";

        // Set the stroke style for the border color
        ctx.strokeStyle = "#000"; // White border for contrast, adjust as needed
        ctx.lineWidth = 4; // Width of the border

        const textX = width / 2 - ctx.measureText(word).width / 2;
        const textY = 350;

        // Draw the border (outline) first
        ctx.strokeText(word, textX, textY);

        // Draw the filled text on top
        ctx.fillText(word, textX, textY);
      },
      {
        fps: 20,
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
      message.guild?.members.cache
        .get(user.id)
        ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" }) ||
        ""
    );
    context.drawImage(avatar, 325, 400, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "lord.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handleInvitedCommand(message: Message) {
    const text = "Sini Diajak";

    // Load and draw on canvas
    const canvas = createCanvas(700, 900);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/invited.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = "80px bold sans-serif";
    context.fillStyle = "#000";
    context.strokeStyle = "#fff";
    context.lineWidth = 8;
    const name = `${text}`;

    // Draw border (stroke) for the text
    context.strokeText(
      name,
      canvas.width / 2 - context.measureText(name).width / 2,
      800
    );

    // Draw filled text on top of the border
    context.fillText(
      name,
      canvas.width / 2 - context.measureText(name).width / 2,
      800
    );

    // Send the image
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "invited.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handleWhenYaCommand(message: Message) {
    const text = "When Ya Diajak";

    // Load and draw on canvas
    const canvas = createCanvas(1366, 768);
    const context = canvas.getContext("2d");
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/when-ya.jpg")
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.font = "80px bold sans-serif";
    context.fillStyle = "#000";
    context.strokeStyle = "#fff";
    context.lineWidth = 8;
    const name = `${text}`;

    // Draw border (stroke) for the text
    context.strokeText(
      name,
      canvas.width / 2 - context.measureText(name).width / 2,
      700
    );

    // Draw filled text on top of the border
    context.fillText(
      name,
      canvas.width / 2 - context.measureText(name).width / 2,
      700
    );

    // Send the image
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "when-ya.png",
    });
    message.channel.send({ files: [attachment] });
  }

  private async handleNopeCommand(message: Message) {
    const text = "Gak Mau";

    // Randomize the background
    const randomImage = Math.floor(Math.random() * 2) + 1;

    switch (randomImage) {
      case 1:
        canvasGif(
          path.join(__dirname, `../../assets/images/nope/${randomImage}.gif`),
          (ctx, width) => {
            const word = `${text}`;
            ctx.font = "60px bold sans-serif";

            // Set the fill style for the text color
            ctx.fillStyle = "#000";

            // Set the stroke style for the border color
            ctx.strokeStyle = "#fff"; // White border for contrast, adjust as needed
            ctx.lineWidth = 4; // Width of the border

            const textX = width / 2 - ctx.measureText(word).width / 2;
            const textY = 270;

            // Draw the border (outline) first
            ctx.strokeText(word, textX, textY);

            // Draw the filled text on top
            ctx.fillText(word, textX, textY);
          },
          {
            fps: 20,
          }
        ).then((buffer) => {
          const attachment = new AttachmentBuilder(buffer, {
            name: "nope.gif",
          });
          message.channel.send({ files: [attachment] });
        });
        break;
      case 2:
        canvasGif(
          path.join(__dirname, `../../assets/images/nope/${randomImage}.gif`),
          (ctx, width) => {
            const word = `${text}`;
            ctx.font = "60px bold sans-serif";

            // Set the fill style for the text color
            ctx.fillStyle = "#000";

            // Set the stroke style for the border color
            ctx.strokeStyle = "#fff"; // White border for contrast, adjust as needed
            ctx.lineWidth = 4; // Width of the border

            const textX = width / 2 - ctx.measureText(word).width / 2;
            const textY = 350;

            // Draw the border (outline) first
            ctx.strokeText(word, textX, textY);

            // Draw the filled text on top
            ctx.fillText(word, textX, textY);
          },
          {
            fps: 20,
          }
        ).then((buffer) => {
          const attachment = new AttachmentBuilder(buffer, {
            name: "nope.gif",
          });
          message.channel.send({ files: [attachment] });
        });
        break;
      default:
        break;
    }
  }

  private async handleLickCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const avatar = await loadImage(
      message.guild?.members.cache
        .get(user.id)
        ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" }) ||
        ""
    );

    canvasGif(
      path.join(__dirname, "../../assets/images/lick.gif"),
      (ctx) => {
        ctx.drawImage(avatar as any, 125, 250, 200, 200);
      },
      {
        fps: 60,
      }
    ).then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, {
        name: "lick.gif",
      });
      message.channel.send({ files: [attachment] });
    });
  }

  private async handleBlackCommand(message: Message) {
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

    canvasGif(
      path.join(__dirname, "../../assets/images/black.gif"),
      (ctx, width) => {
        const word = `${text} Hitam`;
        ctx.font = "40px bold sans-serif";

        // Set the fill style for the text color
        ctx.fillStyle = "#fff";

        // Set the stroke style for the border color
        ctx.strokeStyle = "#000"; // White border for contrast, adjust as needed
        ctx.lineWidth = 4; // Width of the border

        const textX = width / 2 - ctx.measureText(word).width / 2;
        const textY = 250;

        // Draw the border (outline) first
        ctx.strokeText(word, textX, textY);

        // Draw the filled text on top
        ctx.fillText(word, textX, textY);
      },
      {
        fps: 20,
      }
    ).then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, {
        name: "black.gif",
      });
      message.channel.send({ files: [attachment] });
    });
  }

  private async handleMorningCommand(message: Message) {
    const text = "Selamat Pagi";

    canvasGif(
      path.join(__dirname, "../../assets/images/morning.gif"),
      (ctx, width) => {
        const word = `${text}`;
        ctx.font = "40px bold sans-serif";

        // Set the fill style for the text color
        ctx.fillStyle = "#000";

        // Set the stroke style for the border color
        ctx.strokeStyle = "#fff"; // White border for contrast, adjust as needed
        ctx.lineWidth = 4; // Width of the border

        const textX = width / 2 - ctx.measureText(word).width / 2;
        const textY = 210;

        // Draw the border (outline) first
        ctx.strokeText(word, textX, textY);

        // Draw the filled text on top
        ctx.fillText(word, textX, textY);
      },
      {
        fps: 10,
      }
    ).then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, {
        name: "morning.gif",
      });
      message.channel.send({ files: [attachment] });
    });
  }

  private async handleAfternoonCommand(message: Message) {
    const text = "Selamat Siang";

    canvasGif(
      path.join(__dirname, "../../assets/images/afternoon.gif"),
      (ctx, width) => {
        const word = `${text}`;
        ctx.font = "40px bold sans-serif";

        // Set the fill style for the text color
        ctx.fillStyle = "#000";

        // Set the stroke style for the border color
        ctx.strokeStyle = "#fff"; // White border for contrast, adjust as needed
        ctx.lineWidth = 4; // Width of the border

        const textX = width / 2 - ctx.measureText(word).width / 2;
        const textY = 265;

        // Draw the border (outline) first
        ctx.strokeText(word, textX, textY);

        // Draw the filled text on top
        ctx.fillText(word, textX, textY);
      },
      {
        fps: 10,
      }
    ).then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, {
        name: "afternoon.gif",
      });
      message.channel.send({ files: [attachment] });
    });
  }

  private async handleNightCommand(message: Message) {
    const text = "Selamat Malam";

    canvasGif(
      path.join(__dirname, "../../assets/images/night.gif"),
      (ctx, width) => {
        const word = `${text}`;
        ctx.font = "40px bold sans-serif";

        // Set the fill style for the text color
        ctx.fillStyle = "#000";

        // Set the stroke style for the border color
        ctx.strokeStyle = "#fff"; // White border for contrast, adjust as needed
        ctx.lineWidth = 4; // Width of the border

        const textX = width / 2 - ctx.measureText(word).width / 2;
        const textY = 265;

        // Draw the border (outline) first
        ctx.strokeText(word, textX, textY);

        // Draw the filled text on top
        ctx.fillText(word, textX, textY);
      },
      {
        fps: 20,
      }
    ).then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, {
        name: "night.gif",
      });
      message.channel.send({ files: [attachment] });
    });
  }

  private async handleEatCommand(message: Message) {
    const text = "Selamat Makan";

    canvasGif(
      path.join(__dirname, "../../assets/images/eat.gif"),
      (ctx, width) => {
        const word = `${text}`;
        ctx.font = "40px bold sans-serif";

        // Set the fill style for the text color
        ctx.fillStyle = "#000";

        // Set the stroke style for the border color
        ctx.strokeStyle = "#fff"; // White border for contrast, adjust as needed
        ctx.lineWidth = 4; // Width of the border

        const textX = width / 2 - ctx.measureText(word).width / 2;
        const textY = 270;

        // Draw the border (outline) first
        ctx.strokeText(word, textX, textY);

        // Draw the filled text on top
        ctx.fillText(word, textX, textY);
      },
      {
        fps: 10,
      }
    ).then((buffer) => {
      const attachment = new AttachmentBuilder(buffer, {
        name: "eat.gif",
      });
      message.channel.send({ files: [attachment] });
    });
  }

  private async handleHelpCommand(message: Message) {
    const prefix = process.env.PREFIX || "!";

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Hoshino Bot Commands")
      .setDescription("Here are the commands you can use with Hoshino Bot:")
      .addFields(
        {
          name: "👤 Avatar",
          value: `Displays the avatar of a user.\nUsage: \`${prefix}avatar [@user | username | no mention]\``,
          inline: true,
        },
        {
          name: "💥 Slam",
          value: `Performs a slam action on a mentioned user.\nUsage: \`${prefix}slam @user\``,
          inline: true,
        },
        {
          name: "🤗 Hug",
          value: `Sends a hug to a mentioned user.\nUsage: \`${prefix}hug @user\``,
          inline: true,
        },
        {
          name: "👊 Punch",
          value: `Powers a punch at a mentioned user.\nUsage: \`${prefix}punch @user\``,
          inline: true,
        },
        {
          name: "💋 Kiss",
          value: `Sends a kiss to a mentioned user.\nUsage: \`${prefix}kiss @user\``,
          inline: true,
        },
        {
          name: "📩 Come",
          value: `Calls someone to come with a message.\nUsage: \`${prefix}come [message @user | @user]\``,
          inline: true,
        },
        {
          name: "👋 Slap",
          value: `Performs a slap action on a mentioned user.\nUsage: \`${prefix}slap @user\``,
          inline: true,
        },
        {
          name: "🚪 Ditinggal",
          value: `Mentions someone who left.\nUsage: \`${prefix}ditinggal\``,
          inline: true,
        },
        {
          name: "👑 Lord",
          value: `Performs a lord action on a mentioned user.\nUsage: \`${prefix}lord @user\``,
          inline: true,
        },
        {
          name: "🎉 Diajak",
          value: `Mentions someone who joined.\nUsage: \`${prefix}diajak\``,
          inline: true,
        },
        {
          name: "⏳ WhenYa",
          value: `Provides information on 'when ya' scenarios.\nUsage: \`${prefix}whenya\``,
          inline: true,
        },
        {
          name: "🔄 GMW",
          value: `Handles 'gmw' scenarios.\nUsage: \`${prefix}gmw\``,
          inline: true,
        },
        {
          name: "👅 Lick",
          value: `Performs a lick action.\nUsage: \`${prefix}lick @user\``,
          inline: true,
        },
        {
          name: "🖤 Hitam",
          value: `Performs a hitam action.\nUsage: \`${prefix}hitam [message]\``,
          inline: true,
        },
        {
          name: "🌞 Pagi",
          value: `Performs a pagi action.\nUsage: \`${prefix}pagi\``,
          inline: true,
        },
        {
          name: "☀️ Siang",
          value: `Performs a siang action.\nUsage: \`${prefix}siang\``,
          inline: true,
        },
        {
          name: "🌙 Malam",
          value: `Performs a malam action.\nUsage: \`${prefix}malam\``,
          inline: true,
        },
        {
          name: "🍱 Makan",
          value: `Performs a makan action.\nUsage: \`${prefix}makan\``,
          inline: true,
        },
        {
          name: "❓ Help",
          value: `Displays this help message.\nUsage: \`${prefix}help\``,
          inline: true,
        }
      )
      .setFooter({ text: "Use !command for more details on each command" });

    message.channel.send({ embeds: [embed] });
  }
}
