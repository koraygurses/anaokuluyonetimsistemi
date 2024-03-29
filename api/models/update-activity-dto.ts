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
 * @interface UpdateActivityDto
 */
export interface UpdateActivityDto {

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    id?: string;

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    classId?: string;

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    teacher?: string;

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    name?: string;

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    type?: UpdateActivityDtoTypeEnum;

    /**
     * @type {Array<StudentRecordDto>}
     * @memberof UpdateActivityDto
     */
    studentRecords?: Array<StudentRecordDto>;

    /**
     * @type {Array<string>}
     * @memberof UpdateActivityDto
     */
    studentRecordOptions?: Array<string>;

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    date?: string;

    /**
     * @type {number}
     * @memberof UpdateActivityDto
     */
    start?: number;

    /**
     * @type {number}
     * @memberof UpdateActivityDto
     */
    end?: number;

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    description?: string;

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    activityNote?: string;

    /**
     * @type {string}
     * @memberof UpdateActivityDto
     */
    status?: UpdateActivityDtoStatusEnum;

    /**
     * @type {boolean}
     * @memberof UpdateActivityDto
     */
    optionalParticipation?: boolean;
}

/**
 * @export
 * @enum {string}
 */
export enum UpdateActivityDtoTypeEnum {
    Default = 'default',
    Attendance = 'attendance',
    Meal = 'meal'
}
/**
 * @export
 * @enum {string}
 */
export enum UpdateActivityDtoStatusEnum {
    Active = 'active',
    Planned = 'planned',
    Completed = 'completed',
    Cancelled = 'cancelled'
}

