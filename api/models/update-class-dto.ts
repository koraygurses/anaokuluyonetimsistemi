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
 * @interface UpdateClassDto
 */
export interface UpdateClassDto {

    /**
     * @type {string}
     * @memberof UpdateClassDto
     */
    name?: string;

    /**
     * @type {Array<ObjectId>}
     * @memberof UpdateClassDto
     */
    teachers?: Array<ObjectId>;

    /**
     * @type {Array<ObjectId>}
     * @memberof UpdateClassDto
     */
    students?: Array<ObjectId>;
}
