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
 * @interface BulletinDto
 */
export interface BulletinDto {

    /**
     * @type {string}
     * @memberof BulletinDto
     */
    id?: string;

    /**
     * @type {Array<string>}
     * @memberof BulletinDto
     */
    classids: Array<string>;

    /**
     * @type {string}
     * @memberof BulletinDto
     */
    createdBy: string;

    /**
     * @type {string}
     * @memberof BulletinDto
     */
    title: string;

    /**
     * @type {string}
     * @memberof BulletinDto
     */
    description: string;

    /**
     * @type {Date}
     * @memberof BulletinDto
     */
    createdDate: Date;

    /**
     * @type {string}
     * @memberof BulletinDto
     */
    fileName?: string;
}
