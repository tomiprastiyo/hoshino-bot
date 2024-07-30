import express from "express";

export const keepAlive = () => {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Bot is alive!");
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
