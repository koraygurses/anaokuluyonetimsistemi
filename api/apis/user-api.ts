/* tslint:disable */
/* eslint-disable */
/**
 * AYS API
 * AYS API Description
 *
 * OpenAPI spec version: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { RegisterDeviceTokenDto } from '../models';
/**
 * UserApi - axios parameter creator
 * @export
 */
export const UserApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        userControllerDeleteUser: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions: AxiosRequestConfig = { method: 'DELETE', ...baseOptions, ...options };
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        userControllerGetUsers: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions: AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options };
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {RegisterDeviceTokenDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        userControllerRegisterDeviceToken: async (body: RegisterDeviceTokenDto, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling userControllerRegisterDeviceToken.');
            }
            const localVarPath = `/user/register-device-token`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers && localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data = needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} role role string
         * @param {string} userid user id string
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        userControllerSetRole: async (role: string, userid: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'role' is not null or undefined
            if (role === null || role === undefined) {
                throw new RequiredError('role', 'Required parameter role was null or undefined when calling userControllerSetRole.');
            }
            // verify required parameter 'userid' is not null or undefined
            if (userid === null || userid === undefined) {
                throw new RequiredError('userid', 'Required parameter userid was null or undefined when calling userControllerSetRole.');
            }
            const localVarPath = `/user/role/{userid}/{role}`
                .replace(`{${"role"}}`, encodeURIComponent(String(role)))
                .replace(`{${"userid"}}`, encodeURIComponent(String(userid)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        userControllerUpdateUser: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions: AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options };
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UserApi - functional programming interface
 * @export
 */
export const UserApiFp = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerDeleteUser(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<void>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).userControllerDeleteUser(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs: AxiosRequestConfig = { ...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url };
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerGetUsers(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<any>>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).userControllerGetUsers(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs: AxiosRequestConfig = { ...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url };
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {RegisterDeviceTokenDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerRegisterDeviceToken(body: RegisterDeviceTokenDto, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<void>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).userControllerRegisterDeviceToken(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs: AxiosRequestConfig = { ...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url };
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} role role string
         * @param {string} userid user id string
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerSetRole(role: string, userid: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<any>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).userControllerSetRole(role, userid, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs: AxiosRequestConfig = { ...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url };
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerUpdateUser(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<void>>> {
            const localVarAxiosArgs = await UserApiAxiosParamCreator(configuration).userControllerUpdateUser(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs: AxiosRequestConfig = { ...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url };
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * UserApi - factory interface
 * @export
 */
export const UserApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerDeleteUser(options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
            return UserApiFp(configuration).userControllerDeleteUser(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerGetUsers(options?: AxiosRequestConfig): Promise<AxiosResponse<Array<any>>> {
            return UserApiFp(configuration).userControllerGetUsers(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {RegisterDeviceTokenDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerRegisterDeviceToken(body: RegisterDeviceTokenDto, options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
            return UserApiFp(configuration).userControllerRegisterDeviceToken(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} role role string
         * @param {string} userid user id string
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerSetRole(role: string, userid: string, options?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
            return UserApiFp(configuration).userControllerSetRole(role, userid, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async userControllerUpdateUser(options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
            return UserApiFp(configuration).userControllerUpdateUser(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async userControllerDeleteUser(options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
        return UserApiFp(this.configuration).userControllerDeleteUser(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async userControllerGetUsers(options?: AxiosRequestConfig): Promise<AxiosResponse<Array<any>>> {
        return UserApiFp(this.configuration).userControllerGetUsers(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {RegisterDeviceTokenDto} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async userControllerRegisterDeviceToken(body: RegisterDeviceTokenDto, options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
        return UserApiFp(this.configuration).userControllerRegisterDeviceToken(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} role role string
     * @param {string} userid user id string
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async userControllerSetRole(role: string, userid: string, options?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return UserApiFp(this.configuration).userControllerSetRole(role, userid, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public async userControllerUpdateUser(options?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
        return UserApiFp(this.configuration).userControllerUpdateUser(options).then((request) => request(this.axios, this.basePath));
    }
}
