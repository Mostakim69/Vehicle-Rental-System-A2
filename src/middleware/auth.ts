import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    try {
      if (!token) {
        return res.status(500).json({
          message: "You are not allowed!!",
        });
      }

      const decoded = jwt.verify(token, config.jwt_secret!) as JwtPayload;
      console.log(decoded);

      req.user = decoded;

      if (decoded.role === "customer") {
        if (String(decoded.id) === req.params.id) {
          return next();
        } else {
          return res.status(500).json({
            error: "Unauthorized!!!",
          });
        }
      }
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(500).json({
          error: "Unauthorized!!!",
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
