import express, { Application } from "express";

const app: Application = express();

const PORT: number = Number(process.env.PORT) || 3000;

app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});

app.listen(PORT, () => console.info(`Running on port ${PORT}`));
