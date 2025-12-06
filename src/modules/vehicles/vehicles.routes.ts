import { Router } from "express";
import { vehicleControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getVehicle);

router.get("/:id", vehicleControllers.getSingleVehicle);

router.put("/:id", auth("admin"), vehicleControllers.updateVehicle);

router.delete("/:id", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
