import { registerAs } from "@nestjs/config";

export default registerAs("iqair", () => ({
    apiKey: process.env.IQAIR_API_SECRET,
    baseUrl: process.env.IQAIR_BASE_URL,
    serviceName: process.env.IQAIR_SERVICE_NAME,
}));