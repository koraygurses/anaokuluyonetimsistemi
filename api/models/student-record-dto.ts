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

import { RecordDto } from './record-dto';
 /**
 * 
 *
 * @export
 * @interface StudentRecordDto
 */
export interface StudentRecordDto {

    /**
     * @type {any}
     * @memberof StudentRecordDto
     */
    student: any;

    /**
     * @type {Array<RecordDto>}
     * @memberof StudentRecordDto
     */
    records: Array<RecordDto>;

    /**
     * @type {string}
     * @memberof StudentRecordDto
     */
    note?: string;
}
