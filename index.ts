import "reflect-metadata";
import { version, name } from "./package.json";
import "dotenv/config";
import express from "express";
import {AppDataSource} from "./src/config/database";
import userRoutes from "./src/routes/UserRoutes";
import groupRoutes from "./src/routes/GroupRoutes";
import { errorMiddleware } from "./src/middleware/errorMiddleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger";

export const app = express();
app.use(express.json());

// === Root Landing Page ===
app.get("/", (req, res) => {
    res.json({
        app: name,
        version: version,
        status: "Running",
        environment: process.env.NODE_ENV || "development",
        endpoints: [
            { path: "/users", method: "GET", description: "Get all users (paginated)" },
            { path: "/users/bulk-update", method: "PUT", description: "Bulk update user statuses" },
            { path: "/groups", method: "GET", description: "Get all groups (paginated)" }
        ],
        database: AppDataSource.isInitialized ? "Connected" : "Disconnected"
    });
});

// === Swagger ===
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === Mount Routes ===
app.use("/users", userRoutes);
app.use("/groups", groupRoutes);

// === Global Error Handler ===
app.use(errorMiddleware);

const PORT = process.env.PORT || 8080;

// Initialize DB then start server
if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize()
        .then(() => {
            console.log("MySQL Database Connected!");
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => console.log("Database connection failed:", error));
}