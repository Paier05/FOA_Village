// Declaring Needed Constants (We already installed these packages just now)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ogRoute from "./routes/ogRoute.js";
import resourcesRoute from "./routes/resourcesRoute.js"

import errorHandling from "./middlewares/errorHandler.js";

import {
  createOGTable,
  createResourcesTable,
  createLandTable,
  createFreelandTable,
  createWheelTable,
  dropOGTableTrigger,
  dropLandTableTrigger,
  ogTableTriggerFunction,
  ogTableTrigger, 
  landTableTriggerFunction,
  landTableTrigger
} from "./data/createTables.js"

// Testing HTML Frontend
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

// These two lines are necessary to use __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", ogRoute);
app.use("/api", resourcesRoute);

// Error Handling Middlewares
app.use(errorHandling);

// Initialize Tables for Database
async function initializeDatabase()
{
  try 
  {
    await createOGTable();
    await createResourcesTable();
    await createLandTable();
    await createFreelandTable();
    await createWheelTable();
    await dropOGTableTrigger();
    await dropLandTableTrigger();
    await ogTableTriggerFunction();
    await ogTableTrigger();
    await landTableTriggerFunction();
    await landTableTrigger();
  } catch (error)
  {
    console.log("Error initializing database: ", error);
  };
};

// Testing POSTGRESQL Connection
app.get("/", async(req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Run Server After initializing Database
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
