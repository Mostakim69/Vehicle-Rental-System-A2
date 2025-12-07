import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  if (!password || (password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO Users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`,
    [name, email, hashedPassword, phone, role]
  );
  return result;
};

const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM Users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return false;
  }
  delete user.password;
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      id: user.id,
    },
    config.jwt_secret!,
    {
      expiresIn: "7d",
    }
  );
  console.log({ token });
  return { token, user };
};

export const authServices = {
  signupUser,
  signinUser,
};
