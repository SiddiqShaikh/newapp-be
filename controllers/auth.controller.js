import prisma from "../DB/db.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { exclude } from "../utils/helper.js";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);
      //   check unique email exists
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (findUser) {
        return res.status(400).json({
          errors: {
            message: "Email already exists!",
          },
        });
      }
      //   encypt password
      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);
      const user = await prisma.users.create({
        data: payload,
      });

      return res
        .status(201)
        .json({ message: "User Created Successfully!", user });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({ error: "Internal Server Error!!" });
      }
    }
  }

  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (!findUser) {
        return res.status(400).json({ message: "User not exists!" });
      }
      if (!bcrypt.compareSync(payload.password, findUser.password)) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      const payloadData = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        profile: findUser.profile,
      };
      const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });
      const user = exclude(findUser, ["password"]);
      return res
        .status(200)
        .json({
          message: "Logged in successfully!",
          token: `Bearer ${token}`,
          user,
        });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({ error: "Internal Server Error!!" });
      }
    }
  }
}

export default AuthController;
