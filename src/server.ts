import express, { Request, Response } from "express";

const app = express();
const port = 5000;

//parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World of express with typescript!");
});

app.post("/", (req: Request, res: Response) => {
      console.log(req.body)

  res.status(201).json ({
    success: true,
    message: "Server is running successfully",
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
