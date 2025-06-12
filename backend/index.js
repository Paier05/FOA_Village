// Declaring Needed Constants (We already installed these packages just now)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/authRoute.js";
import ogRoute from "./routes/ogRoute.js";
import resourcesRoute from "./routes/resourcesRoute.js";
import landRoute from "./routes/landRoute.js";
import freelandRoute from "./routes/freelandRoute.js";
import wheelRoute from "./routes/wheelRoute.js";
import ogPermittedRoute from "./routes/ogPermittedRoute.js";

import errorHandling from "./middlewares/errorHandler.js";

import {
  createUsersTable,
  createOGTable,
  createResourcesTable,
  createLandTable,
  createFreelandTable,
  initializeFreelandTable,
  createWheelTable,
  dropUsersTableTrigger,
  dropLandTableTrigger,
  usersTableTriggerFunction,
  usersTableTrigger, 
  landTableTriggerFunction,
  landTableTrigger
} from "./data/createTables.js"

// Testing HTML Frontend
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "public" directory
// app.use(express.static(path.join(__dirname, "../frontend")));

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/ogpr", ogPermittedRoute);
app.use("/api", ogRoute);
app.use("/api", resourcesRoute);
app.use("/api", landRoute);
app.use("/api", freelandRoute);
app.use("/api", wheelRoute);

// Error Handling Middlewares
app.use(errorHandling);

// Initialize Tables for Database
async function initializeDatabase()
{
  try 
  {
    await createUsersTable();
    await createOGTable();
    await createResourcesTable();
    await createLandTable();
    await createFreelandTable();
    await initializeFreelandTable();
    await createWheelTable();
    await dropUsersTableTrigger();
    await dropLandTableTrigger();
    await usersTableTriggerFunction();
    await usersTableTrigger();
    await landTableTriggerFunction();
    await landTableTrigger();
  } catch (error)
  {
    console.log("Error initializing database: ", error);
  };
};

// Testing POSTGRESQL Connection
//app.get("/", async(req, res) => {
//  res.sendFile(path.join(frontendPath, "login.html"));
//});

// Run Server After initializing Database
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
