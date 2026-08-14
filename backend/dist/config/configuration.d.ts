export declare const config: () => {
    port: number;
    nodeEnv: string;
    backendUrl: string;
    clientUrl: string;
    mongodb: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
        oauthUrl: string;
    };
    mail: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
        from: string;
    };
    redis: string;
};
