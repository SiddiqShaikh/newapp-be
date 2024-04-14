import prisma from "../DB/db.config.js";
import { exclude, generateUniqueId, imageValidator } from "../utils/helper.js";

class ProfileController {
  static async index(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json({ user, message: "User" });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const authUser = req.user;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Profile Image is required" });
    }
    const profile = req.files.profile;
    const message = imageValidator(profile?.size, profile?.mimetype);
    if (message !== null) {
      return res.status(400).json({
        errors: {
          profile: message,
        },
      });
    }
    const imgExt = profile?.name.split(".");
    const imageName = generateUniqueId() + "." + imgExt[1];
    const uploadPath = process.cwd() + "/public/images/" + imageName;

    profile.mv(uploadPath, (err) => {
      if (err) throw err;
    });

    const updateUser = await prisma.users.update({
      data: {
        profile: imageName,
      },
      where: {
        id: Number(id),
      },
    });
    if (!updateUser) {
      return res.status(400).json({ message: "Something went wrong!!" });
    }
    const userWithoutPassword = exclude(updateUser, ['password'])
    return res.status(201).json({
      message: "Profile Image Updated!",
      userWithoutPassword,
    });
  }
}

export default ProfileController;
