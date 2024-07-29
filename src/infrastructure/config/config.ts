import "dotenv/config";

interface Config {
  discordToken: string;
}

const config: Config = {
  discordToken: process.env.DISCORD_TOKEN || "",
};

if (!config.discordToken) {
  throw new Error("DISCORD_TOKEN must be provided");
}

export default config;
