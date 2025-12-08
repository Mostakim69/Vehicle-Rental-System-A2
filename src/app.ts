import express, { Request, Response } from "express";
import initDB from "./config/db";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/users.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";

const app = express();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//initialize DB
initDB();

//auth routes
app.use("/api/v1/auth/", authRoutes);

//vehicles CRUD
app.use("/api/v1/vehicles", vehicleRoutes);

//users routes
app.use("/api/v1/users", userRoutes);

//booking routes
app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
