import {
  faUser,
  faBook,
  faIdCard,
  faSquareCheck,
  faSquareXmark,
  faUtensils,
  faBowlFood,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IonItemGroup,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
} from "@ionic/react";
import React from "react";
import {
  ActivityDto,
  ActivityDtoTypeEnum,
  RecordDto,
  StudentDto,
  StudentRecordDto,
} from "../../../api/models";
import AysUtils from "../../utils/AysUtils";

interface Props {
  students: StudentDto[];
  activity: ActivityDto;
}

function ActivityItemRecord(props: Props) {
  const colorIndex = ["danger", "warning", "success"];

  let studentsIds: string[] = [];
  let studentsRecords: StudentRecordDto[] = [];

  if (props.students) {
    studentsIds = props.students.map((student) => {
      return (student as any)._id as string;
    });
    (props.activity.studentRecords as StudentRecordDto[]).map((record) => {
      if (studentsIds.includes(record.student._id)) {
        studentsRecords.push(record);
      }
    });
  }

  const mealRecordColor = (mealRecord: RecordDto) => {
    return colorIndex[
      (props.activity.studentRecordOptions as string[]).indexOf(
        mealRecord.completion as string
      )
    ];
  };

  return (
    <>
      {props.students && (
        <>
          {(props.activity.studentRecords as StudentRecordDto[]).map(
            (record) => {
              if (studentsIds.includes(record.student._id)) {
                return (
                  <IonItemGroup key={record.student._id + props.activity.id}>
                    {record.note && (
                      <IonChip className="ays-chip-student w100 ays-mt5">
                        <IonGrid>
                          <IonRow>
                            <IonCol size="12" className="text-start">
                              <FontAwesomeIcon
                                className="ays-pr5"
                                icon={faUser}
                              />
                              {record.student.name}
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="12" className="text-start">
                              <FontAwesomeIcon
                                className="ays-pr5"
                                icon={faBook}
                              />
                              Not :{" "}
                              <IonNote className="ays-color-dusk">
                                {record.note}
                              </IonNote>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonChip>
                    )}
                    {props.activity.type === ActivityDtoTypeEnum.Attendance && (
                      <IonRow className="ays-no-m ays-pt5">
                        {!record.note && (
                          <IonChip className="ays-chip-student ays-mt5 w100">
                            <FontAwesomeIcon
                              className="ays-pr5"
                              icon={faUser}
                            />
                            {record.student.name}
                          </IonChip>
                        )}
                        <IonChip
                          className="ays-chip ion-justify-content-between ays-pl12 ays-pr12 ays-mt5 ays-chip-border w100"
                          color={
                            record.records[0].completion
                              ? record.records[0].completion.toLowerCase() ===
                                "true"
                                ? "success"
                                : record.records[0].completion.toLowerCase() ===
                                  "false"
                                ? "danger"
                                : "danger"
                              : "danger"
                          }
                        >
                          <div
                            key={
                              record.student._id +
                              record.student.name +
                              ActivityDtoTypeEnum.Attendance +
                              record.records[0].completion
                            }
                          >
                            <FontAwesomeIcon
                              className="ays-pr5"
                              size="lg"
                              icon={faIdCard}
                            />
                            <IonNote color="medium" className="ays-chip">
                              Yoklama :
                            </IonNote>
                          </div>
                          <FontAwesomeIcon
                            className="ays-no-m ays-no-p"
                            size="xl"
                            icon={
                              record.records[0].completion
                                ? record.records[0].completion.toLowerCase() ===
                                  "true"
                                  ? faSquareCheck
                                  : record.records[0].completion.toLowerCase() ===
                                    "false"
                                  ? faSquareXmark
                                  : faSquareXmark
                                : faSquareXmark
                            }
                          />
                        </IonChip>
                      </IonRow>
                    )}
                    {props.activity.type === ActivityDtoTypeEnum.Meal && (
                      <div
                        key={
                          props.activity.id +
                          record.student._id +
                          ActivityDtoTypeEnum.Meal
                        }
                      >
                        <IonRow
                          data-bu="bouk"
                          className="ays-no-p ays-no-m ion-justify-content-center"
                        >
                          <IonChip
                            className="ays-chip ays-no-p ays-no-m w100"
                            color="light"
                          >
                            <IonGrid className="ays-no-p ays-no-m">
                              {!record.note && (
                                <IonRow className="w100">
                                  <IonChip className="ays-mt5 ion-justify-content-start ays-chip-student w100">
                                    <div>
                                      <FontAwesomeIcon
                                        className="ays-pr5"
                                        icon={faUser}
                                      />
                                      {record.student.name}
                                    </div>
                                  </IonChip>
                                </IonRow>
                              )}
                              <IonRow>
                                {record.records.map((mealRecord, index) => (
                                  <IonCol
                                    key={
                                      record.student._id +
                                      props.activity.id +
                                      ActivityDtoTypeEnum.Meal +
                                      mealRecord.recordType +
                                      index +
                                      IonCol.name
                                    }
                                    className="w100"
                                    size="12"
                                  >
                                    <div
                                      key={
                                        record.student._id +
                                        props.activity.id +
                                        ActivityDtoTypeEnum.Meal +
                                        mealRecord.recordType +
                                        index
                                      }
                                    >
                                      <IonChip
                                        className="ays-no-m ion-justify-content-between ays-chip ays-chip-border w100"
                                        color={mealRecordColor(mealRecord)}
                                      >
                                        <div>
                                          <FontAwesomeIcon
                                            className="ays-pr5"
                                            size="lg"
                                            icon={faBowlFood}
                                          />
                                          <IonNote
                                            className="ays-chip"
                                            color={`medium`}
                                          >
                                            {mealRecord.recordType}
                                          </IonNote>
                                        </div>
                                        <IonNote
                                          color={mealRecordColor(mealRecord)}
                                        >
                                          {AysUtils.capitalizeFirstLetter(
                                            mealRecord.completion as string
                                          )}
                                        </IonNote>
                                      </IonChip>
                                    </div>
                                  </IonCol>
                                ))}
                              </IonRow>
                            </IonGrid>
                          </IonChip>
                        </IonRow>
                      </div>
                    )}
                  </IonItemGroup>
                );
              }
            }
          )}
        </>
      )}
    </>
  );
}

export default ActivityItemRecord;
