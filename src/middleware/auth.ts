import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Authorization token missing",
        });
      }
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret!
      ) as JwtPayload & {
        id: number;
        role: string;
      };
      console.log(decoded);

      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          error: "You do not have permission to perform this action",
        });
      }
      if (decoded.role === "customer" && req.params.id) {
        if (String(decoded.id) !== req.params.id) {
          return res.status(403).json({
            error: "Unauthorized to access this resource",
          });
        }
      }
      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default auth;
