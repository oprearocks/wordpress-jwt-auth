import axios from 'axios';
import defaults, { OPTIONS } from './Defaults';

/**
 * JWT Response after successfully authenticated user
 */
export interface JWT {
    /**
     * JWT Token used in every request
     */
    token: string;

    /**
     * User email
     */
    user_email: string;

    /**
     * User full name
     */
    user_nicename: string;

    /**
     * Displayed username
     */
    user_display_name: string;
}

let CONFIG: OPTIONS = Object.assign({}, defaults);

export const configure = (options: OPTIONS): void => {
    CONFIG = Object.assign(CONFIG, options);
}

/**
 * Authenticate user
 * @param host - host URL
 * @param username - user's name used to login
 * @param password - user's password used to login
 * @throws {CannotAuthenticate}
 */
export const generateToken = async (host: string, username: string, password: string): Promise<JWT> => {
    const generateTokenEndpoint = `${host}/${CONFIG.JWT_ENDPOINT}/${CONFIG.JWT_ROUTE_GENERATE}`;
    const response = await axios.post(generateTokenEndpoint, { username, password }, {
        headers: {
            ...CONFIG.HEADERS,
        },
    });
    switch (response.status) {
        case 403: throw new Error('CannotAuthenticate: Bad username or password');
        case 404: throw new Error(`CannotAuthenticate: Page doesn\'t exists, make sure JWT is installed`);
    }

    return response.data as JWT;
};

/**
 * Validate token
 * @param host - host URL
 * @param token - token to validate
 * @returns true if token is successfully validated
 */
export const validateToken = async (host: string, token: string): Promise<boolean> => {
    const validateTokenEndpoint = `${host}/${CONFIG.JWT_ENDPOINT}/${CONFIG.JWT_ROUTE_VALIDATE}`;
    const headers = { headers: { Authorization: 'Bearer ' + token, ...CONFIG.HEADERS } };
    const response = await axios.post(validateTokenEndpoint, {}, headers);
    if (response.status === 200) {
        return true;
    }
    return false;
};

/**
 * Connect to wordpress jwt API
 * @param host - url to wordpress
 * @throws {CannotConnect}
 */
export const connectToJwt = async (host: string) => {
    const generateTokenEndpoint = `${host}/${CONFIG.JWT_ENDPOINT}/${CONFIG.JWT_ROUTE_GENERATE}`;
    const response = await axios.post(generateTokenEndpoint, {}, {
        headers: {
            ...CONFIG.HEADERS,
        },
    });
    if (response.status === 404) {
        throw new Error('CannotConnect: bad host or JWT is not installed');
    }

    return {
        /**
         * Authenticate user
         * @param username - user's name used to login
         * @param password - user's password used to login
         * @throws {CannotAuthenticate}
         */
        generateToken: generateToken.bind(null, host) as (username: string, password: string) => Promise<JWT>,

        /**
         * Validate token
         * @param token - token to validate
         * @returns true if token is successfully validated
         */
        validateToken: validateToken.bind(null, host) as (token: string) => boolean,
    };
};
