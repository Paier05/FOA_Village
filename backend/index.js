import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/authRoute.js";
import adminPermittedRoute from "./routes/adminPermittedRoute.js";
import npcPermittedRoute from "./routes/npcPermittedRoute.js";
import modPermittedRoute from "./routes/modPermittedRoute.js";
import ogPermittedRoute from "./routes/ogPermittedRoute.js";
import allPermittedRoute from "./routes/allPermittedRoute.js";

import errorHandling from "./middlewares/errorHandler.js";
import autoExpireInventory from "./controllers/autoInventoryUpdate.js";

import {
  createUsersTable,
  createOGTable,
  createResourcesTable,
  createLandTable,
  createFreelandTable,
  initializeFreelandTable,
  createWheelTable,
  createGamePhaseTable,
  initializeGamePhaseTable,
  createEventsTable,
  initializeEventsTable,
  createInventoryTable,
  dropUsersTableTrigger,
  dropLandTableTrigger,
  dropLandTableScoreTrigger,
  usersTableTriggerFunction,
  usersTableTrigger, 
  landTableTriggerFunction,
  landTableTrigger,
  landTableScoreTriggerFunction,
  landTableScoreTrigger
} from "./data/createTables.js"

dotenv.config();

const app = express();
const port = process.env.APP_PORT;
const apphost = process.env.APP_HOST;
const frontendUrl = process.env.FRONTEND_URL;

app.use(cookieParser());

app.use(
  cors({
    origin: frontendUrl,
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/ogpr", ogPermittedRoute);
app.use("/api/mpr", modPermittedRoute);
app.use("/api/npcpr", npcPermittedRoute);
app.use("/api/apr", adminPermittedRoute);
app.use("/api/allpr", allPermittedRoute);

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
    await createGamePhaseTable();
    await initializeGamePhaseTable();
    await createInventoryTable();
    await createEventsTable();
    await initializeEventsTable();
    await dropUsersTableTrigger();
    await dropLandTableTrigger();
    await dropLandTableScoreTrigger();
    await usersTableTriggerFunction();
    await usersTableTrigger();
    await landTableTriggerFunction();
    await landTableTrigger();
    await landTableScoreTriggerFunction();
    await landTableScoreTrigger();
  } catch (error)
  {
    console.log("Error initializing database: ", error);
  };
};

// Run Server After initializing Database
initializeDatabase().then(() => {
  app.listen(port, apphost, () => {
    console.log(`Server running on http://${apphost}:${port}`);
    
    // Auto Update Inventory every minute
    setInterval(() => {
      autoExpireInventory();
    }, 30 * 1000);
  });
});
