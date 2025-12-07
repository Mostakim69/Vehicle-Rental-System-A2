import { pool } from "../../config/db";

const getAllUser = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  return result;
};

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const existing = await pool.query(`SELECT * FROM Users WHERE id=$1`, [id]);
  if (existing.rows.length === 0) throw new Error("User not found");

  const user = existing.rows[0];

  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `UPDATE Users SET name=$1, email=$2, phone=$3, role=$4 WHERE id = $5 RETURNING *`,
    [
      name || user.name,
      email || user.email,
      phone || user.phone,
      role || user.role,
      id,
    ]
  );
  return result;
};

const deleteUser = async (id: string) => {
  const bookings = await pool.query(
    `SELECT * FROM Bookings WHERE customer_id=$1 AND status='active'`,
    [id]
  );
  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete user: active bookings exist");
  }
  const existing = await pool.query(`SELECT * FROM Users WHERE id=$1`, [id]);
  if (existing.rows.length === 0) {
    throw new Error("User not found");
  }

  await pool.query(`DELETE FROM Users WHERE id=$1`, [id]);
};
export const userServices = {
  getAllUser,
  updateUser,
  deleteUser,
};
