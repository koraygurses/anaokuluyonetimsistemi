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
 * @interface CreateTeacherDto
 */
export interface CreateTeacherDto {

    /**
     * @type {string}
     * @memberof CreateTeacherDto
     */
    gsm: string;

    /**
     * @type {string}
     * @memberof CreateTeacherDto
     */
    name: string;

    /**
     * @type {string}
     * @memberof CreateTeacherDto
     */
    email: string;

    /**
     * @type {string}
     * @memberof CreateTeacherDto
     */
    gender: CreateTeacherDtoGenderEnum;

    /**
     * @type {number}
     * @memberof CreateTeacherDto
     */
    birth: number;

    /**
     * @type {Array<ObjectId>}
     * @memberof CreateTeacherDto
     */
    classid?: Array<ObjectId>;
}

/**
 * @export
 * @enum {string}
 */
export enum CreateTeacherDtoGenderEnum {
    Male = 'male',
    Female = 'female'
}

