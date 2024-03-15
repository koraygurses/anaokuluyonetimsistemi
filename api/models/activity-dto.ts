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

import { StudentRecordDto } from './student-record-dto';
 /**
 * 
 *
 * @export
 * @interface ActivityDto
 */
export interface ActivityDto {

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    id?: string;

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    classId: string;

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    teacher?: string;

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    name: string;

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    type: ActivityDtoTypeEnum;

    /**
     * @type {Array<StudentRecordDto>}
     * @memberof ActivityDto
     */
    studentRecords?: Array<StudentRecordDto>;

    /**
     * @type {Array<string>}
     * @memberof ActivityDto
     */
    studentRecordOptions?: Array<string>;

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    date: string;

    /**
     * @type {number}
     * @memberof ActivityDto
     */
    start: number;

    /**
     * @type {number}
     * @memberof ActivityDto
     */
    end: number;

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    description: string;

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    activityNote?: string;

    /**
     * @type {string}
     * @memberof ActivityDto
     */
    status: ActivityDtoStatusEnum;

    /**
     * @type {boolean}
     * @memberof ActivityDto
     */
    optionalParticipation: boolean;
}

/**
 * @export
 * @enum {string}
 */
export enum ActivityDtoTypeEnum {
    Default = 'default',
    Attendance = 'attendance',
    Meal = 'meal'
}
/**
 * @export
 * @enum {string}
 */
export enum ActivityDtoStatusEnum {
    Active = 'active',
    Planned = 'planned',
    Completed = 'completed',
    Cancelled = 'cancelled'
}

