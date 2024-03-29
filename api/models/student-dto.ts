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
 * @interface StudentDto
 */
export interface StudentDto {

    /**
     * @type {string}
     * @memberof StudentDto
     */
    id?: string;

    /**
     * @type {any}
     * @memberof StudentDto
     */
    classid: any;

    /**
     * @type {number}
     * @memberof StudentDto
     */
    studentid: number;

    /**
     * @type {string}
     * @memberof StudentDto
     */
    name: string;

    /**
     * @type {string}
     * @memberof StudentDto
     */
    gender: StudentDtoGenderEnum;

    /**
     * @type {Array<ObjectId>}
     * @memberof StudentDto
     */
    parents?: Array<ObjectId>;

    /**
     * @type {number}
     * @memberof StudentDto
     */
    birth: number;
}

/**
 * @export
 * @enum {string}
 */
export enum StudentDtoGenderEnum {
    Male = 'male',
    Female = 'female'
}

