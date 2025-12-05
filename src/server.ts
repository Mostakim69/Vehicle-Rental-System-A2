import express, { Request, Response } from "express";
const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World of bangladesh!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
