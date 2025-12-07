import { Router } from "express";
import { bookingControllers } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);

router.get("/", auth("admin", "customer"), bookingControllers.getBooking);

router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
