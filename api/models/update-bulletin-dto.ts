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

 /**
 * 
 *
 * @export
 * @interface UpdateBulletinDto
 */
export interface UpdateBulletinDto {

    /**
     * @type {string}
     * @memberof UpdateBulletinDto
     */
    title?: string;

    /**
     * @type {string}
     * @memberof UpdateBulletinDto
     */
    description?: string;

    /**
     * @type {Date}
     * @memberof UpdateBulletinDto
     */
    createdDate?: Date;

    /**
     * @type {string}
     * @memberof UpdateBulletinDto
     */
    fileName?: string;

    /**
     * @type {string}
     * @memberof UpdateBulletinDto
     */
    id?: string;

    /**
     * @type {Array<string>}
     * @memberof UpdateBulletinDto
     */
    classids?: Array<string>;

    /**
     * @type {string}
     * @memberof UpdateBulletinDto
     */
    createdBy?: string;
}
