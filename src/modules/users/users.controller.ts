import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUser();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (req.user!.role === "customer" && req.user!.id !== Number(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    const result = await userServices.updateUser(req.body, req.params.id!);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    await userServices.deleteUser(userId!);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const userController = {
  getAllUser,
  updateUser,
  deleteUser,
};
