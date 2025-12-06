import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/users.routes";

const app = express();
const port = config.port;

// intializing DB
initDB();

// parser
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is Root Api",
    path: req.path,
  });
});

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);

app.listen(5000, () => {
  console.log(`Server on running on port: ${port}`);
});
