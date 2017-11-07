export default {
    JWT_ENDPOINT: '/wp-json/jwt-auth/v1',
    JWT_ROUTE_VALIDATE: '/validate',
    JWT_ROUTE_GENERATE: '/token',
    HEADERS: {},
};

export interface OPTIONS {
    JWT_ENDPOINT: string;
    JWT_ROUTE_VALIDATE: string;
    JWT_ROUTE_GENERATE: string;
    HEADERS: Object;
}
