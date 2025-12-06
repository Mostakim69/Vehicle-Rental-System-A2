import { pool } from "../../config/db";

const getAllUser = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  return result;
};

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `UPDATE Users SET name=$1, email=$2, phone=$3, role=$4 WHERE id = $5 RETURNING *`,
    [name, email, phone, role, id]
  );
  return result;
};

export const userServices = {
  getAllUser,
  updateUser,
};
