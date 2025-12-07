import { pool } from "../../config/db";
const autoMarkReturned = async () => {
  try {
    const { rows: overdueBookings } = await pool.query(
      `SELECT * FROM Bookings WHERE status='active' AND rent_end_date < NOW()`
    );

    for (const booking of overdueBookings) {
      await pool.query(`UPDATE Bookings SET status='returned' WHERE id=$1`, [
        booking.id,
      ]);
      await pool.query(
        `UPDATE Vehicles SET availability_status='available' WHERE id=$1`,
        [booking.vehicle_id]
      );
      console.log(`Booking ${booking.id} marked as returned automatically.`);
    }
  } catch (error) {
    console.error("Error in autoMarkReturned:", error);
  }
};

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload!;

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);
  if (end <= start) throw new Error("End date must be after start date");
  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const vehicleResult = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status FROM Vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    return { success: false, message: "Vehicle not found" };
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    return { success: false, message: "Vehicle not available" };
  }

  const total_price = totalDays * (vehicle.daily_rent_price as number);

  const result = await pool.query(
    `INSERT INTO Bookings(customer_id,vehicle_id,rent_start_date,rent_end_date, total_price, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  await pool.query(
    `UPDATE Vehicles SET availability_status= $1 WHERE id=$2 RETURNING *`,
    ["booked", vehicle_id]
  );
  return {
    success: true,
    data: {
      ...result.rows[0],
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    },
  };
};

const getBooking = async (user: any) => {
  await autoMarkReturned();
  if (user.role === "admin") {
    const bookingResult = await pool.query(`SELECT * FROM Bookings`);

    const bookings = bookingResult.rows;

    for (const booking of bookings) {
      const customerResult = await pool.query(
        `SELECT name,email FROM Users WHERE id =$1`,
        [booking.customer_id]
      );
      const vehiclesResult = await pool.query(
        ` SELECT vehicle_name, registration_number FROM Vehicles WHERE id=$1`,
        [booking.vehicle_id]
      );
      booking.customer = customerResult.rows[0];
      booking.vehicle = vehiclesResult.rows[0];
    }
    return {
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    };
  }
  const bookingResult = await pool.query(
    `SELECT * FROM Bookings WHERE customer_id=$1`,
    [user.id]
  );

  const bookings = bookingResult.rows;

  for (const booking of bookings) {
    const vehicleRes = await pool.query(
      `SELECT vehicle_name, registration_number, type FROM Vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );

    booking.vehicle = vehicleRes.rows[0];
  }
  return {
    success: true,
    message: "Your bookings retrieved successfully",
    data: bookings,
  };
};

const updateBooking = async (
  user: any,
  payload: Record<string, unknown>,
  id: string
) => {
  await autoMarkReturned();
  const { status } = payload;

  const bookingResult = await pool.query(
    `SELECT * FROM Bookings WHERE id =$1`,
    [id]
  );

  if (bookingResult.rows.length === 0) {
    return { success: false, message: "Booking not found" };
  }
  const booking = bookingResult.rows[0];

  if (user.role === "customer") {
    if (status !== "cancelled") {
      return {
        success: false,
        message: "Customers can only cancel their booking",
      };
    }
    const now = new Date();
    const startDate = new Date(booking.rent_start_date);
    if (now >= startDate) {
      return {
        success: false,
        message: "Cannot cancel booking after start date",
      };
    }
  }

  const updated = await pool.query(
    `UPDATE Bookings SET status=$1 WHERE id =  $2 RETURNING *`,
    [status, id]
  );

  const updatedBooking = updated.rows[0];

  if (user.role === "admin" && status === "returned") {
    const updatedVehicle = await pool.query(
      `UPDATE Vehicles SET availability_status ='available' WHERE id=$1 RETURNING *`,
      [updatedBooking.vehicle_id]
    );
    return {
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...updatedBooking,
        vehicle: updatedVehicle.rows[0],
      },
    };
  }
  if (status === "cancelled") {
    return {
      success: true,
      message: "Booking cancelled successfully",
      data: updatedBooking,
    };
  }
  return {
    success: true,
    message: "Booking updated successfully",
    data: updatedBooking,
  };
};

export const bookingServices = {
  createBooking,
  getBooking,
  updateBooking,
};
