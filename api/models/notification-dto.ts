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

import { ObjectId } from './object-id';
 /**
 * 
 *
 * @export
 * @interface NotificationDto
 */
export interface NotificationDto {

    /**
     * @type {ObjectId}
     * @memberof NotificationDto
     */
    bulletinId: ObjectId;

    /**
     * @type {ObjectId}
     * @memberof NotificationDto
     */
    userId: ObjectId;

    /**
     * @type {boolean}
     * @memberof NotificationDto
     */
    isSeen: boolean;
}
