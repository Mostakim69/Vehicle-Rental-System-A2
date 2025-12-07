import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO Vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getVehicle = async () => {
  const result = await pool.query(`SELECT * FROM Vehicles`);
  return result.rows;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [id]);
  return result;
};

const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const existing = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [id]);
  if (existing.rows.length === 0) throw new Error("Vehicle not found");

  const vehicle = existing.rows[0];

  const result = await pool.query(
    `UPDATE Vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4,availability_status=$5 WHERE id =$6 RETURNING *`,
    [
      vehicle_name || vehicle.vehicle_name,
      type || vehicle.type,
      registration_number || vehicle.registration_number,
      daily_rent_price || vehicle.daily_rent_price,
      availability_status || vehicle.availability_status,
      id,
    ]
  );
  return result;
};

const deleteVehicle = async (id: string) => {
  const bookings = await pool.query(
    `SELECT * FROM Vehicles WHERE id=$1 AND availability_status='booked'`,
    [id]
  );

  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle: active bookings exist");
  }

  const result = await pool.query(`DELETE FROM Vehicles WHERE id = $1`, [id]);
  return result;
};

export const vehicleServices = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
