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
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);


  await pool.query(`CREATE TABLE IF NOT EXISTS Vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(150) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK(type IN ('car', 'bike', 'van','SUV')),
        registration_number VARCHAR(200) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL CHECK(daily_rent_price>0),
        availability_status VARCHAR(100) NOT NULL CHECK (availability_status IN ('available','booked'))
        )`);

  // console.log("Database initialized");
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
