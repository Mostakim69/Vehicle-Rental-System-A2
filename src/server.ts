import express, { Request, Response } from "express";
import {Pool} from "pg"
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT || 5000;
//parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      phone VARCHAR(15),
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 

    );
  `);
  console.log("Database initialized");
}

initDB().catch((err) => console.error("Error initializing database:", err));



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
