import express from "express";
import env from "@/config/ENV";
import adminRoutes from "@/routes/adminRoute";
import publicRoutes from "@/routes/publicRoute";
const app = express();
const port = env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use("/public", publicRoutes);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
