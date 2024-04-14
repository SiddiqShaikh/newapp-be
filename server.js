import express from "express";
import "dotenv/config";
const app = express();
import fileUpload from "express-fileupload";

const PORT = process.env.PORT || 8000;
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
// test route
app.get("/", (req, res) => {
  return res.json({ message: "Server is running" });
});

// api routes import
import AuthRoutes from "./routes/auth.routes.js";
import ProfileRoutes from "./routes/profile.routes.js";
app.use("/api/v1", AuthRoutes);
app.use("/api/v1/profile", ProfileRoutes);
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
