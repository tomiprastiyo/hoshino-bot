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

    // Load background image and user avatar
    const [background, avatar] = await Promise.all([
      loadImage(path.join(__dirname, "../../assets/images/slam.jpg")),
      loadImage(
        message.guild?.members.cache
          .get(user.id)
          ?.displayAvatarURL({ extension: "png" }) ||
          user.displayAvatarURL({ extension: "png" })
      ),
    ]);

    // Draw background and avatar on the canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.rotate((-20 * Math.PI) / 180);
    context.drawImage(avatar, 550, 350, 200, 200);

    // Create and send the attachment
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "slam.png",
    });
    await message.channel.send({ files: [attachment] });
  }

  private async handleHugCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const canvas = createCanvas(1200, 1300);
    const context = canvas.getContext("2d");

    // Randomize the background
    const randomImage = Math.floor(Math.random() * 2) + 1;

    // Load user avatar
    const avatar = await loadImage(
      message.guild?.members.cache
        .get(user.id)
        ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" })
    );

    switch (randomImage) {
      case 1:
        // Load the background for case 1
        const background = await loadImage(
          path.join(__dirname, `../../assets/images/hug/${randomImage}.jpg`)
        );

        // Draw background and avatar on the canvas
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(700, 680, 175, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.rotate((-40 * Math.PI) / 180);
        context.drawImage(avatar, -75, 780, 400, 400);

        // Create and send the attachment
        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
          name: "hug.png",
        });
        await message.channel.send({ files: [attachment] });
        break;
      case 2:
        // Handle GIF case for randomImage 2
        await canvasGif(
          path.join(__dirname, `../../assets/images/hug/${randomImage}.gif`),
          (ctx) => {
            ctx.beginPath();
            ctx.rotate((-40 * Math.PI) / 180);
            ctx.drawImage(avatar as any, -20, 150, 65, 65);
          },
          { fps: 20 }
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
    const args = message.content.split(/\s+/);
    const target = args[1];

    // Determine the user to punch
    let user =
      message.mentions.users.first() ||
      this.client.users.cache.find((user) => user.tag === target);

    // Determine the text to use
    const text = user?.displayName || target;
    if (!text) return;

    // Load and draw on canvas
    const canvas = createCanvas(500, 500);
    const context = canvas.getContext("2d");

    // Load background image
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/punch.jpg")
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw text on canvas
    context.font = "60px bold sans-serif";
    context.fillStyle = "#000";
    const name = `Pukul ${text}`;
    const textWidth = context.measureText(name).width;
    context.fillText(name, (canvas.width - textWidth) / 2, 450);

    // Send the image
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "punch.png",
    });
    await message.channel.send({ files: [attachment] });
  }

  private async handleKissCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const canvas = createCanvas(1366, 768);
    const context = canvas.getContext("2d");

    // Randomize the background
    const randomImage = Math.floor(Math.random() * 2) + 1;

    // Load the background and user avatar
    const [background, avatar] = await Promise.all([
      loadImage(
        path.join(__dirname, `../../assets/images/kiss/${randomImage}.jpg`)
      ),
      loadImage(
        message.guild?.members.cache
          .get(user.id)
          ?.displayAvatarURL({ extension: "png" }) ||
          user.displayAvatarURL({ extension: "png" })
      ),
    ]);

    // Draw the background on the canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw the avatar based on the randomized background
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

    // Create and send the attachment
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "kiss.png",
    });
    await message.channel.send({ files: [attachment] });
  }

  private async handleComeCommand(message: Message) {
    const mentions = message.mentions.users;

    // Extract and clean the command content
    const cleanedContent = message.content
      .split(/\s+/) // Split by whitespace
      .slice(1) // Remove the command prefix
      .filter((word) => !mentions.has(word.replace(/[<@!>]/g, ""))) // Remove mentions
      .join(" ") // Join the remaining words
      .replace(/[|_]+/g, "") // Remove | and _
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim(); // Trim leading and trailing spaces

    if (cleanedContent === "") return;

    const canvas = createCanvas(1366, 768);
    const context = canvas.getContext("2d");

    // Load background image
    const background = await loadImage(
      path.join(__dirname, "../../assets/images/come.jpg")
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const fontSize = 80;
    const avatarSize = 200;
    const positionX = 800;
    const positionY = 250;

    // Load and draw avatars for mentions
    if (mentions.size > 0) {
      const users = Array.from(mentions.values());
      await Promise.all(
        users.map(async (user, index) => {
          const avatarURL =
            message.guild?.members.cache
              .get(user.id)
              ?.displayAvatarURL({ extension: "png" }) ||
            user.displayAvatarURL({ extension: "png" });
          if (avatarURL) {
            const avatar = await loadImage(avatarURL);
            const positionCustomX = positionX + index * 100;
            context.drawImage(
              avatar,
              positionCustomX,
              positionY,
              avatarSize,
              avatarSize
            );
          }
        })
      );
    }

    // Load and draw the author's avatar
    const authorAvatarURL =
      message.guild?.members.cache
        .get(message.author.id)
        ?.displayAvatarURL({ extension: "png", size: 2048 }) ||
      message.author.displayAvatarURL({ extension: "png", size: 2048 });
    if (authorAvatarURL) {
      const avatarAuthor = await loadImage(authorAvatarURL);
      context.drawImage(avatarAuthor, 250, 275, 200, 200);
    }

    // Draw the text
    context.font = `${fontSize}px bold sans-serif`;
    context.fillStyle = "#fff";
    context.strokeStyle = "#000";
    context.lineWidth = 8;

    const name = cleanedContent;
    const textWidth = context.measureText(name).width;

    context.strokeText(name, (canvas.width - textWidth) / 2, 700);
    context.fillText(name, (canvas.width - textWidth) / 2, 700);

    // Send the image
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "come.png",
    });
    await message.channel.send({ files: [attachment] });
  }

  private async handleSlapCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    const canvas = createCanvas(1366, 768);
    const context = canvas.getContext("2d");

    // Load background and user avatar concurrently
    const [background, avatarURL] = await Promise.all([
      loadImage(path.join(__dirname, "../../assets/images/slap.jpg")),
      (async () => {
        return (
          message.guild?.members.cache
            .get(user.id)
            ?.displayAvatarURL({ extension: "png" }) ||
          user.displayAvatarURL({ extension: "png" })
        );
      })(),
    ]);

    // Draw the background
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Load and draw the avatar
    if (avatarURL) {
      const avatar = await loadImage(avatarURL);
      context.save(); // Save current state
      context.rotate((5 * Math.PI) / 180);
      context.drawImage(avatar, 125, 200, 500, 500);
      context.restore(); // Restore original state
    }

    // Send the image
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "slap.png",
    });
    await message.channel.send({ files: [attachment] });
  }

  private async handleAbandonedCommand(message: Message) {
    const text = "Ditinggal Mabar";
    const gifPath = path.join(__dirname, "../../assets/images/abandoned.gif");

    try {
      // Generate the GIF with text overlay
      const buffer = await canvasGif(
        gifPath,
        (ctx, width) => {
          const fontSize = 40;
          const textX = (width - ctx.measureText(text).width) / 2;
          const textY = 350;

          ctx.font = `${fontSize}px bold sans-serif`;
          ctx.fillStyle = "#fff";
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 4;

          // Draw the border (outline) first
          ctx.strokeText(text, textX, textY);

          // Draw the filled text on top
          ctx.fillText(text, textX, textY);
        },
        { fps: 20 }
      );

      // Send the GIF
      const attachment = new AttachmentBuilder(buffer, {
        name: "abandoned.gif",
      });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error handling abandoned command:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleLordCommand(message: Message) {
    const canvasWidth = 768;
    const canvasHeight = 1366;
    const avatarSize = 200;
    const avatarPositionX = 325;
    const avatarPositionY = 400;
    const backgroundPath = path.join(__dirname, "../../assets/images/lord.jpg");

    try {
      // Fetch the mentioned user
      const user = message.mentions.users.first();
      if (!user) return;

      // Initialize canvas and context
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const context = canvas.getContext("2d");

      // Load the background image
      const background = await loadImage(backgroundPath);
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Load the user's avatar
      const avatarUrl =
        message.guild?.members.cache
          .get(user.id)
          ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" }) ||
        "";

      const avatar = await loadImage(avatarUrl);

      // Draw the avatar on the canvas
      context.drawImage(
        avatar,
        avatarPositionX,
        avatarPositionY,
        avatarSize,
        avatarSize
      );

      // Create and send the image attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "lord.png",
      });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleLordCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleInvitedCommand(message: Message) {
    const canvasWidth = 700;
    const canvasHeight = 900;
    const text = "Sini Diajak";
    const textPositionY = 800;
    const backgroundPath = path.join(
      __dirname,
      "../../assets/images/invited.jpg"
    );

    try {
      // Initialize canvas and context
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const context = canvas.getContext("2d");

      // Load the background image
      const background = await loadImage(backgroundPath);
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Set text styles
      context.font = "80px bold sans-serif";
      context.fillStyle = "#000";
      context.strokeStyle = "#fff";
      context.lineWidth = 8;

      // Calculate text position
      const textPositionX =
        canvas.width / 2 - context.measureText(text).width / 2;

      // Draw text border (stroke) and filled text
      context.strokeText(text, textPositionX, textPositionY);
      context.fillText(text, textPositionX, textPositionY);

      // Create and send the image attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "invited.png",
      });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleInvitedCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleWhenYaCommand(message: Message) {
    const text = "When Ya Diajak";
    const canvasWidth = 1366;
    const canvasHeight = 768;
    const fontSize = 80;
    const textPositionY = 700;

    try {
      // Load the background image
      const background = await loadImage(
        path.join(__dirname, "../../assets/images/when-ya.jpg")
      );

      // Initialize canvas and context
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const context = canvas.getContext("2d");

      // Draw the background
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Set up text styling
      context.font = `${fontSize}px bold sans-serif`;
      context.fillStyle = "#000";
      context.strokeStyle = "#fff";
      context.lineWidth = 8;

      // Calculate text position
      const textPositionX =
        (canvas.width - context.measureText(text).width) / 2;

      // Draw the text with stroke and fill
      context.strokeText(text, textPositionX, textPositionY);
      context.fillText(text, textPositionX, textPositionY);

      // Create and send the image attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "when-ya.png",
      });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleWhenYaCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleNopeCommand(message: Message) {
    const text = "Gak Mau";
    const fontSize = "60px bold sans-serif";
    const textFillColor = "#000";
    const textStrokeColor = "#fff";
    const lineWidth = 4;
    const fps = 20;

    // Randomize the background image
    const randomImage = Math.floor(Math.random() * 2) + 1;
    const imagePath = path.join(
      __dirname,
      `../../assets/images/nope/${randomImage}.gif`
    );

    try {
      // Generate the GIF with canvas
      const buffer = await canvasGif(
        imagePath,
        (ctx, width) => {
          ctx.font = fontSize;
          ctx.fillStyle = textFillColor;
          ctx.strokeStyle = textStrokeColor;
          ctx.lineWidth = lineWidth;

          const textX = width / 2 - ctx.measureText(text).width / 2;
          let textY = 0; // Adjust the Y position based on the random image

          switch (randomImage) {
            case 1:
              textY = 270;
              break;
            case 2:
              textY = 350;
              break;
            default:
              break;
          }

          // Draw the border (stroke) and filled text
          ctx.strokeText(text, textX, textY);
          ctx.fillText(text, textX, textY);
        },
        { fps }
      );

      // Create and send the attachment
      const attachment = new AttachmentBuilder(buffer, { name: "nope.gif" });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleNopeCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleLickCommand(message: Message) {
    const user = message.mentions.users.first();
    if (!user) return;

    try {
      const userAvatarURL =
        message.guild?.members.cache
          .get(user.id)
          ?.displayAvatarURL({ extension: "png" }) ||
        user.displayAvatarURL({ extension: "png" }) ||
        "";

      const avatar = await loadImage(userAvatarURL);

      // Generate the GIF with canvas
      const buffer = await canvasGif(
        path.join(__dirname, "../../assets/images/lick.gif"),
        (ctx) => {
          ctx.drawImage(avatar as any, 125, 250, 200, 200);
        },
        { fps: 60 }
      );

      // Create and send the attachment
      const attachment = new AttachmentBuilder(buffer, { name: "lick.gif" });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleLickCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleBlackCommand(message: Message) {
    const args = message.content.split(" ");
    const target = args[1];

    // Determine the user to punch
    const user =
      message.mentions.users.first() ||
      this.client.users.cache.find((u) => u.tag === target);

    // Determine the text to use
    const text = user ? user.username : target;
    if (!text) return;

    try {
      // Generate the GIF with canvas
      const buffer = await canvasGif(
        path.join(__dirname, "../../assets/images/black.gif"),
        (ctx, width) => {
          const word = `${text} Hitam`;
          ctx.font = "40px bold sans-serif";
          ctx.fillStyle = "#fff"; // Text color
          ctx.strokeStyle = "#000"; // Border color
          ctx.lineWidth = 4; // Border width

          const textX = (width - ctx.measureText(word).width) / 2;
          const textY = 250;

          // Draw the text with border
          ctx.strokeText(word, textX, textY);
          ctx.fillText(word, textX, textY);
        },
        { fps: 20 }
      );

      // Create and send the attachment
      const attachment = new AttachmentBuilder(buffer, { name: "black.gif" });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleBlackCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleMorningCommand(message: Message) {
    const text = "Selamat Pagi";
    const gifPath = path.join(__dirname, "../../assets/images/morning.gif");

    try {
      // Generate the GIF with canvas
      const buffer = await canvasGif(
        gifPath,
        (ctx, width) => {
          ctx.font = "40px bold sans-serif";
          ctx.fillStyle = "#000"; // Text color
          ctx.strokeStyle = "#fff"; // Border color
          ctx.lineWidth = 4; // Border width

          const textX = (width - ctx.measureText(text).width) / 2;
          const textY = 210;

          // Draw the text with border
          ctx.strokeText(text, textX, textY);
          ctx.fillText(text, textX, textY);
        },
        { fps: 10 }
      );

      // Create and send the attachment
      const attachment = new AttachmentBuilder(buffer, { name: "morning.gif" });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleMorningCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleAfternoonCommand(message: Message) {
    const text = "Selamat Siang";
    const gifPath = path.join(__dirname, "../../assets/images/afternoon.gif");

    try {
      // Generate the GIF with canvas
      const buffer = await canvasGif(
        gifPath,
        (ctx, width) => {
          ctx.font = "40px bold sans-serif";
          ctx.fillStyle = "#000"; // Text color
          ctx.strokeStyle = "#fff"; // Border color
          ctx.lineWidth = 4; // Border width

          const textX = (width - ctx.measureText(text).width) / 2;
          const textY = 265;

          // Draw the text with border
          ctx.strokeText(text, textX, textY);
          ctx.fillText(text, textX, textY);
        },
        { fps: 10 }
      );

      // Create and send the attachment
      const attachment = new AttachmentBuilder(buffer, {
        name: "afternoon.gif",
      });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleAfternoonCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleNightCommand(message: Message) {
    const text = "Selamat Malam";
    const gifPath = path.join(__dirname, "../../assets/images/night.gif");

    try {
      // Generate the GIF with canvas
      const buffer = await canvasGif(
        gifPath,
        (ctx, width) => {
          ctx.font = "40px bold sans-serif";
          ctx.fillStyle = "#000"; // Text color
          ctx.strokeStyle = "#fff"; // Border color
          ctx.lineWidth = 4; // Border width

          const textX = (width - ctx.measureText(text).width) / 2;
          const textY = 265;

          // Draw the text with border
          ctx.strokeText(text, textX, textY);
          ctx.fillText(text, textX, textY);
        },
        { fps: 20 }
      );

      // Create and send the attachment
      const attachment = new AttachmentBuilder(buffer, { name: "night.gif" });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleNightCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleEatCommand(message: Message) {
    const text = "Selamat Makan";
    const gifPath = path.join(__dirname, "../../assets/images/eat.gif");

    try {
      // Generate the GIF with canvas
      const buffer = await canvasGif(
        gifPath,
        (ctx, width) => {
          ctx.font = "40px bold sans-serif";
          ctx.fillStyle = "#000"; // Text color
          ctx.strokeStyle = "#fff"; // Border color
          ctx.lineWidth = 4; // Border width

          const textX = (width - ctx.measureText(text).width) / 2;
          const textY = 270;

          // Draw the text with border
          ctx.strokeText(text, textX, textY);
          ctx.fillText(text, textX, textY);
        },
        { fps: 10 }
      );

      // Create and send the attachment
      const attachment = new AttachmentBuilder(buffer, { name: "eat.gif" });
      await message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error in handleEatCommand:", error);
      await message.channel.send(
        "An error occurred while processing the command."
      );
    }
  }

  private async handleHelpCommand(message: Message) {
    const prefix = process.env.PREFIX || "!";

    const commands = [
      {
        name: "👤 Avatar",
        description: `Displays the avatar of a user.\nUsage: \`${prefix}avatar [@user | username | no mention]\``,
      },
      {
        name: "💥 Slam",
        description: `Performs a slam action on a mentioned user.\nUsage: \`${prefix}slam @user\``,
      },
      {
        name: "🤗 Hug",
        description: `Sends a hug to a mentioned user.\nUsage: \`${prefix}hug @user\``,
      },
      {
        name: "👊 Punch",
        description: `Powers a punch at a mentioned user.\nUsage: \`${prefix}punch @user\``,
      },
      {
        name: "💋 Kiss",
        description: `Sends a kiss to a mentioned user.\nUsage: \`${prefix}kiss @user\``,
      },
      {
        name: "📩 Come",
        description: `Calls someone to come with a message.\nUsage: \`${prefix}come [message @user | @user]\``,
      },
      {
        name: "👋 Slap",
        description: `Performs a slap action on a mentioned user.\nUsage: \`${prefix}slap @user\``,
      },
      {
        name: "🚪 Ditinggal",
        description: `Mentions someone who left.\nUsage: \`${prefix}ditinggal\``,
      },
      {
        name: "👑 Lord",
        description: `Performs a lord action on a mentioned user.\nUsage: \`${prefix}lord @user\``,
      },
      {
        name: "🎉 Diajak",
        description: `Mentions someone who joined.\nUsage: \`${prefix}diajak\``,
      },
      {
        name: "⏳ WhenYa",
        description: `Provides information on 'when ya' scenarios.\nUsage: \`${prefix}whenya\``,
      },
      {
        name: "🔄 GMW",
        description: `Handles 'gmw' scenarios.\nUsage: \`${prefix}gmw\``,
      },
      {
        name: "👅 Lick",
        description: `Performs a lick action.\nUsage: \`${prefix}lick @user\``,
      },
      {
        name: "🖤 Hitam",
        description: `Performs a hitam action.\nUsage: \`${prefix}hitam [message | @user]\``,
      },
      {
        name: "🌞 Pagi",
        description: `Performs a pagi action.\nUsage: \`${prefix}pagi\``,
      },
      {
        name: "☀️ Siang",
        description: `Performs a siang action.\nUsage: \`${prefix}siang\``,
      },
      {
        name: "🌙 Malam",
        description: `Performs a malam action.\nUsage: \`${prefix}malam\``,
      },
      {
        name: "🍱 Makan",
        description: `Performs a makan action.\nUsage: \`${prefix}makan\``,
      },
      {
        name: "❓ Help",
        description: `Displays this help message.\nUsage: \`${prefix}help\``,
      },
    ];

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Hoshino Bot Commands")
      .setDescription("Here are the commands you can use with Hoshino Bot:")
      .addFields(
        commands.map((cmd) => ({
          name: cmd.name,
          value: cmd.description,
          inline: true,
        }))
      )
      .setFooter({ text: "Use !command for more details on each command" });

    await message.channel.send({ embeds: [embed] });
  }
}
