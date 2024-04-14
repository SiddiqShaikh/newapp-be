import jwt from "jsonwebtoken";

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unautorized!" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unautorized!" });
    }
    req.user = user;
    next();
  });
};

export default AuthMiddleware;
