"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const config = () => ({
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    backendUrl: process.env.BACKEND_URL ||
        'http://localhost:4000',
    clientUrl: process.env.FRONTEND_URL ||
        'http://localhost:3000',
    mongodb: {
        uri: process.env.MONGODB_URI ||
            'mongodb://localhost:27017/task_management',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
        refreshSecret: process.env.JWT_REFRESH_TOKEN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL ||
            'http://localhost:4000/api/auth/google/callback',
        oauthUrl: process.env.GOOGLE_OAUTH ||
            'https://oauth2.googleapis.com/token',
    },
    mail: {
        host: process.env.MAIL_HOST ||
            'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT || '587', 10),
        secure: process.env.MAIL_SECURE === 'true',
        user: process.env.MAIL_USER || '',
        password: process.env.MAIL_PASSWORD || '',
        from: process.env.MAIL_USER ||
            '',
    },
    redis: process.env.REDIS_URL,
    BREVO_KEY: process.env.BREVO_API_KEY,
    GROQ_KEY: process.env.GROQ_API_KEY
});
exports.config = config;
//# sourceMappingURL=configuration.js.map