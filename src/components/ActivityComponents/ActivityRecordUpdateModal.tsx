import {
  InputChangeEventDetail,
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemGroup,
  IonList,
  IonModal,
  IonNote,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { useMemo, useState } from "react";
import {
  ActivityDto,
  ActivityDtoTypeEnum,
  RecordDto,
  StudentRecordDto,
  UpdateActivityDto,
  UpdateActivityDtoStatusEnum,
  UpdateActivityDtoTypeEnum,
} from "../../../api/models";
import { ActivityApi } from "../../../api/api";
import AysUtils from "../../utils/AysUtils";
import {
  add,
  removeCircleOutline,
  closeOutline,
  arrowBackOutline,
} from "ionicons/icons";
import React from "react";
import {
  faBookOpen,
  faIdCard,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayEventDetail } from "@ionic/core";
import ActivityMeal from "./ActivityMeal";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import "../../theme/responsive.css";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

interface ModalEvents {
  isRecordUpdateModalOpen: ActivityDto;
  setRecordUpdateModalOpen: React.Dispatch<React.SetStateAction<ActivityDto>>;
  refreshActivityPage: (
    createdActivityList?: ActivityDto[],
    updatedActivity?: UpdateActivityDto,
    deletedActivityId?: string
  ) => void;
}

function ActivityRecordUpdateModal({
  isRecordUpdateModalOpen,
  setRecordUpdateModalOpen,
  refreshActivityPage,
}: ModalEvents) {
  (isRecordUpdateModalOpen.studentRecords as StudentRecordDto[]).map(
    (record, index) => {
      if (!record.student) {
        console.log("bu yazı çıkıyosa db bozuktur");
        (isRecordUpdateModalOpen.studentRecords as StudentRecordDto[]).splice(
          index,
          1
        );
      } else {
        // console.log(record.student);
      }
    }
  );

  const api = new ActivityApi({ basePath: AYS_BASEPATH });

  const [isFailToastOpen, setFailToastOpen] = useState({
    isOpen: false,
    message: "",
  });
  const [isActionSheetOpen, setActionSheetOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(
    UpdateActivityDtoTypeEnum.Default
  );

  const recordNoteRefs: React.RefObject<HTMLInputElement>[] = useMemo(
    () =>
      Array(
        (isRecordUpdateModalOpen.studentRecords as StudentRecordDto[]).length
      )
        .fill(
          (isRecordUpdateModalOpen.studentRecords as StudentRecordDto[]).length
        )
        .map((i) => React.createRef()),
    []
  );

  const recordAttendanceRefs: React.RefObject<HTMLInputElement>[] = useMemo(
    () =>
      Array(
        (isRecordUpdateModalOpen.studentRecords as StudentRecordDto[]).length
      )
        .fill(
          (isRecordUpdateModalOpen.studentRecords as StudentRecordDto[]).length
        )
        .map((i) => React.createRef()),
    []
  );

  const getMealRecords = () => {
    let studentRecords =
      isRecordUpdateModalOpen.studentRecords as StudentRecordDto[];

    if (studentRecords && studentRecords.length > 0) {
      let tempStudentRecord = studentRecords[0];

      if (
        tempStudentRecord &&
        tempStudentRecord.records &&
        tempStudentRecord.records.length > 0
      ) {
        return tempStudentRecord.records.map((record, index) => {
          return {
            type: record.recordType as string,
            ref: Array(studentRecords.length)
              .fill(null)
              .map(() => React.createRef<HTMLIonRangeElement>()),
          };
        });
      }
    }

    return [];
  };

  const recordMealRefs: {
    type: string;
    ref: React.RefObject<HTMLIonRangeElement>[];
  }[] = useMemo(() => getMealRecords(), []);

  //useRef focus
  // const handleChange = (index: number) => (e: any) => {
  //   //onChange(e); // don't know about the logic of this onChange if you have multiple inputs
  //   if (recordNoteRefs[index + 1])
  //     (recordNoteRefs[index + 1].current as HTMLIonTextareaElement).focus();
  // };

  const attendanceStr = AysUtils.convertActivityTypeToEnum(
    ActivityDtoTypeEnum.Attendance
  );
  const mealStr = AysUtils.convertActivityTypeToEnum(ActivityDtoTypeEnum.Meal);
  const defaultStr = AysUtils.convertActivityTypeToEnum(
    ActivityDtoTypeEnum.Default
  );

  const handleSelectChange = (event: CustomEvent) => {
    if (event.detail.value === defaultStr) {
      setSelectedType(UpdateActivityDtoTypeEnum.Default);
    } else if (event.detail.value === attendanceStr) {
      setSelectedType(UpdateActivityDtoTypeEnum.Attendance);
    } else {
      setSelectedType(UpdateActivityDtoTypeEnum.Meal);
    }
  };

  const triggerConfirmEvent = async () => {
    let studentRecordList: StudentRecordDto[] = [];

    await createStudentRecords().then((studentRecords) => {
      studentRecordList = [...studentRecords];
    });

    const activityInfo: UpdateActivityDto = {
      id: (isRecordUpdateModalOpen as any)._id,
      studentRecords: studentRecordList,
    };

    await api.activityControllerUpdateActivity(activityInfo).then((res) => {
      // console.log(res);
    });

    refreshActivityPage([], activityInfo);
  };

  const createStudentRecords = async (): Promise<StudentRecordDto[]> => {
    const activityRecordList = isRecordUpdateModalOpen.studentRecords;
    let studentRecordList: StudentRecordDto[] = [];

    if (activityRecordList)
      activityRecordList.map((studentRecord, index) => {
        // useRef ve gelen verilerin aynı indexlerde aynı recordlara sahip olduğu varsayılır
        if (isRecordUpdateModalOpen.type === ActivityDtoTypeEnum.Default) {
          studentRecordList[index] = {
            ...studentRecord,
            note: (recordNoteRefs[index].current as HTMLInputElement)
              .value as string,
            records: [],
          } as StudentRecordDto;
        } else if (isRecordUpdateModalOpen.type === ActivityDtoTypeEnum.Meal) {
          studentRecordList[index] = {
            ...studentRecord,
            note: (recordNoteRefs[index].current as HTMLInputElement)
              .value as string,
            records: recordMealRefs.map(
              (refs: {
                type: string;
                ref: React.RefObject<HTMLIonRangeElement>[];
              }) => {
                return {
                  recordType: refs.type,
                  completion: (
                    isRecordUpdateModalOpen.studentRecordOptions as string[]
                  )[
                    ((refs.ref[index].current as HTMLIonRangeElement)
                      .value as number) - 1
                  ],
                } as RecordDto;
              }
            ),
          } as StudentRecordDto;
        } else if (
          isRecordUpdateModalOpen.type === ActivityDtoTypeEnum.Attendance
        ) {
          studentRecordList[index] = {
            ...studentRecord,
            note: (recordNoteRefs[index].current as HTMLInputElement)
              .value as string,
            records: [
              {
                recordType: "Yoklama",
                completion: String(
                  (recordAttendanceRefs[index].current as HTMLInputElement)
                    .checked
                ),
              },
            ],
          } as StudentRecordDto;
        }
      });

    return studentRecordList;
  };

  const [mealList, setMealList] = useState([""]);

  const handleInputChange =
    (index: number) => (e: CustomEvent<InputChangeEventDetail>) => {
      mealList[index] = (e.target as HTMLInputElement).value;
    };

  const handleAddInput = () => {
    setMealList([...mealList, ""]);
  };

  const handleRemoveInput = (index: number) => {
    if (mealList.length > 1) {
      const updatedValues = [...mealList];
      updatedValues.splice(index, 1);
      setMealList(updatedValues);
    }
  };

  function getTypeRelationedItem(activityType: UpdateActivityDtoTypeEnum) {
    if (activityType === UpdateActivityDtoTypeEnum.Meal) {
      return (
        <IonList>
          {mealList.map((value, index) => (
            <IonItem key={index}>
              <IonInput
                value={value}
                onIonChange={handleInputChange(index)}
              ></IonInput>
              {mealList.length > 1 && (
                <IonIcon
                  color="primary"
                  icon={removeCircleOutline}
                  onClick={() => handleRemoveInput(index)}
                />
              )}
            </IonItem>
          ))}
          <IonItem lines="none">
            <IonButton fill="clear" onClick={handleAddInput}>
              <IonIcon slot="start" icon={add}></IonIcon>Yemek Ekle
            </IonButton>
          </IonItem>
        </IonList>
      );
    }
  }

  const triggerDeleteEvent = async () => {
    setActionSheetOpen(true);
  };

  const dismissActionSheet = async (result: OverlayEventDetail) => {
    let action: string = "";

    if (result.data) {
      action = result.data.action;
    } else {
      action = "cancel";
    }

    if (action === "delete") {
      setActionSheetOpen(false);

      if ((isRecordUpdateModalOpen as any)._id)
        await api
          .activityControllerDeleteActivity(
            (isRecordUpdateModalOpen as any)._id
          )
          .catch((request) => {
            // console.log(request.data);
          });

      refreshActivityPage([], undefined, (isRecordUpdateModalOpen as any)._id);
    } else if (action === "cancel") {
      setActionSheetOpen(false);
    }
  };

  const isWideScreen = useMediaQuery({ query: "(min-width:620px" });

  return (
    <IonModal
      mode="ios"
      isOpen={(isRecordUpdateModalOpen as any)._id ? true : false}
      onWillDismiss={() => {
        setFailToastOpen({ isOpen: false, message: "" });
        setRecordUpdateModalOpen({} as ActivityDto);
      }}
      className="fullscreen-modal"
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isRecordUpdateModalOpen.name}</IonTitle>
          {isWideScreen ? (
            <IonButtons slot="start">
              <IonButton
                onClick={() => {
                  setFailToastOpen({ isOpen: false, message: "" });
                  setRecordUpdateModalOpen({} as ActivityDto);
                }}
                color="medium"
              >
                <IonIcon size="large" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
          ) : (
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  setFailToastOpen({ isOpen: false, message: "" });
                  setRecordUpdateModalOpen({} as ActivityDto);
                }}
                color="medium"
              >
                <IonIcon size="large" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <Container
        fluid
        className="d-flex justify-content-center overflow-auto p-0"
      >
        <Col xs={12} sm={7} md={6} lg={5}>
          <Container fluid className="p-0">
            {(isRecordUpdateModalOpen.studentRecords as StudentRecordDto[]).map(
              (record, index) => (
                <div
                  className="ays-bgcolor-light border ays-record-item m-2 p-2"
                  key={record.student._id}
                >
                  <Row className="m-0 my-1">
                    <Col className="p-0 ays-bold">{record.student.name}</Col>
                    {isRecordUpdateModalOpen.type ===
                      ActivityDtoTypeEnum.Attendance && (
                      <Col className="d-flex justify-content-end p-0">
                        <Form.Check // prettier-ignore
                          type="switch"
                          id="custom-switch"
                          className="ays-yoklama"
                          ref={recordAttendanceRefs[index]}
                          defaultChecked={
                            record.records[0].completion
                              ? record.records[0].completion.toLowerCase() ===
                                "true"
                                ? true
                                : record.records[0].completion.toLowerCase() ===
                                  "false"
                                ? false
                                : false
                              : false
                          }
                        />
                      </Col>
                    )}
                  </Row>
                  {isRecordUpdateModalOpen.type ===
                    ActivityDtoTypeEnum.Meal && (
                    <Row className="m-0 my-1">
                      <Col className="p-0">
                        <div className="my-2">
                          {record.records.map((mealRecord, index2) => {
                            if (!mealRecord.completion) {
                              mealRecord.completion = (
                                isRecordUpdateModalOpen.studentRecordOptions as string[]
                              )[0];
                            } else {
                              // console.log(
                              //   record.student.name + " " + mealRecord.completion
                              // );
                            }
                            return (
                              <ActivityMeal
                                key={
                                  mealRecord.recordType +
                                  isRecordUpdateModalOpen.date +
                                  record.student._id
                                }
                                keykey={
                                  mealRecord.recordType +
                                  isRecordUpdateModalOpen.date +
                                  record.student._id
                                }
                                mealName={mealRecord.recordType as string}
                                refref={recordMealRefs[index2].ref[index]}
                                min={1}
                                max={
                                  (
                                    isRecordUpdateModalOpen.studentRecordOptions as string[]
                                  ).length
                                }
                                value={(
                                  isRecordUpdateModalOpen.studentRecordOptions as string[]
                                ).indexOf(mealRecord.completion as string)}
                                recordOptions={
                                  isRecordUpdateModalOpen.studentRecordOptions as string[]
                                }
                              ></ActivityMeal>
                            );
                          })}
                        </div>
                      </Col>
                    </Row>
                  )}
                  <Row className="m-0">
                    <InputGroup className="p-0">
                      <InputGroup.Text id="basic-addon1">
                        <FontAwesomeIcon
                          className="ays-color-primary"
                          icon={faNoteSticky}
                        ></FontAwesomeIcon>
                        <div className="ms-2">Not</div>
                      </InputGroup.Text>
                      <Form.Control
                        autoFocus={true}
                        defaultValue={record.note}
                        data-id={String(record.student._id)}
                        ref={recordNoteRefs[index]}
                        placeholder="..."
                      />
                    </InputGroup>
                  </Row>
                </div>
              )
            )}
          </Container>
        </Col>
      </Container>
      <IonFooter>
        <div className="p-1">
          <Row className="d-flex flex-row justify-content-center">
            <Col
              sm="6"
              lg="4"
              xl="3"
              className="d-flex flex-row justify-content-center"
            >
              <ButtonGroup className="ays-border-none w100">
                <Button
                  className="ays-bgcolor-primary ays-border-none"
                  onClick={triggerConfirmEvent}
                >
                  Onayla
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </div>
      </IonFooter>
      <IonToast
        isOpen={isFailToastOpen.isOpen}
        message={isFailToastOpen.message}
        color="danger"
        onDidDismiss={() => setFailToastOpen({ isOpen: false, message: "" })}
        duration={3000}
      ></IonToast>
      <IonActionSheet
        isOpen={isActionSheetOpen}
        header="Aktiviteyi silmekte emin misiniz?"
        // subHeader="Sil"
        buttons={[
          {
            text: "Sil",
            role: "destructive",
            data: {
              action: "delete",
            },
          },
          {
            text: "Vazgeç",
            role: "cancel",
            data: {
              action: "cancel",
            },
          },
        ]}
        onWillDismiss={({ detail }) => dismissActionSheet(detail)}
      ></IonActionSheet>
    </IonModal>
  );
}

export default ActivityRecordUpdateModal;
