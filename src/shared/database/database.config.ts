import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    type: process.env.DB_TYPE || "mysql",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "airquality",
}));