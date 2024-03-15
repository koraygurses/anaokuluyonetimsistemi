import {
  InputChangeEventDetail,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ActivityDto,
  ActivityDtoStatusEnum,
  ActivityDtoTypeEnum,
  ClassDto,
  MultipleAcitivityDto,
  RecordDto,
  StudentDto,
  StudentRecordDto,
} from "../../../api/models";
import { ActivityApi, ClassApi } from "../../../api/api";
import AysUtils, { Days, getDateFromTime } from "../../utils/AysUtils";
import {
  add,
  closeOutline,
  removeCircleOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { AxiosResponse } from "axios";
import DayPickerComponent, {
  ActivityCreationDayPicker,
} from "./ActivityCreationModalComponents/DayPickerComponent";
import DateTimePickerModal from "../../utils/DateTimePickerModal";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import {
  Row,
  Col,
  ButtonGroup,
  Button,
  Container,
  Form,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

interface ModalEvents {
  activeClass: ClassDto;
  classList: ClassDto[];
  date: Date;
  startDate?: Date;
  endDate?: Date;
  modalInfo: {
    isCreateModalOpen: boolean;
    activityType: ActivityDtoTypeEnum;
  };
  closeModal: () => void;
  refreshActivityPage: (createdActivityList?: ActivityDto[]) => void;
}

const hourOffset = 3; //Yerel Saat conversion

function ActivityCreationModal({
  activeClass,
  classList,
  date,
  modalInfo,
  closeModal,
  refreshActivityPage,
}: ModalEvents) {
  const api = new ActivityApi({ basePath: AYS_BASEPATH });
  const classApi = new ClassApi({ basePath: AYS_BASEPATH });

  const initToastInfo = {
    isToastOpen: false,
    toastMsg: {} as string,
  };

  const dayPickerRef = useRef<ActivityCreationDayPicker>(null);

  //Toastlara refactor lazım
  const [toastInfo, setToastInfo] = useState(initToastInfo);

  const [dateTimePickerModalOpen, setDateTimePickerModalOpen] = useState(false);
  const [multipleActivityCreation, setMultipleActivityCreation] =
    useState(false);
  const [activityDateList, setActivityDateList] = useState([] as Date[]);
  const [selectedType, setSelectedType] = useState(modalInfo.activityType);
  const [selectedFinalDate, setSelectedFinalDate] = useState<Date | null>(null);

  let defaultStartTimeInput = new Date();
  defaultStartTimeInput.setHours(defaultStartTimeInput.getHours() + hourOffset);
  let defaultEndTimeInput = new Date();
  defaultEndTimeInput.setHours(defaultEndTimeInput.getHours() + hourOffset + 1);

  const activityTitleInput = useRef<HTMLInputElement>(null);
  const detailInput = useRef<HTMLTextAreaElement>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const dateInput = useRef<HTMLIonInputElement>(null);
  const startTimeInput = useRef<HTMLInputElement>(null);
  const endTimeInput = useRef<HTMLInputElement>(null);
  const classRef = useRef<HTMLIonSelectElement>(null);

  const dayList = Object.values(Days);
  const attendanceStr = AysUtils.convertActivityTypeToEnum(
    ActivityDtoTypeEnum.Attendance
  ).toString();
  const mealStr = AysUtils.convertActivityTypeToEnum(
    ActivityDtoTypeEnum.Meal
  ).toString();
  const defaultStr = AysUtils.convertActivityTypeToEnum(
    ActivityDtoTypeEnum.Default
  ).toString();

  useEffect(() => {
    
    setSelectedType(modalInfo.activityType);
  }, [modalInfo.activityType]);

  useEffect(() => {
    let currentdate = new Date();
    let updatedActivityDateList: Date[] = [];

    if (dayPickerRef.current) {
      let clickedDayList = dayPickerRef.current.getClickedDayList();

      const dayIndexes = clickedDayList.map((day) => {
        let dayIndex = dayList.indexOf(day);
        dayIndex = dayIndex + 1;
        if (dayIndex > 6) {
          dayIndex = 0;
        }

        return dayIndex;
      });

      if (selectedFinalDate && clickedDayList.length > 0) {
        while (
          removeHourSection(currentdate).getTime() <=
          removeHourSection(selectedFinalDate).getTime()
        ) {
          if (dayIndexes.includes(currentdate.getDay())) {
            updatedActivityDateList.push(new Date(currentdate));
          }

          currentdate = new Date(currentdate);
          currentdate.setDate(currentdate.getDate() + 1);
        }

        setActivityDateList(updatedActivityDateList);
      }
    }
  }, [selectedFinalDate]);

  function removeHourSection(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
  }

  const triggerConfirmEvent = async () => {
    let activityTitle = (activityTitleInput.current as HTMLInputElement).value;
    let activityDetail = (detailInput.current as HTMLTextAreaElement).value;
    let activityNote = (noteInput.current as HTMLTextAreaElement).value;
    let selectedClassList = (classRef.current as HTMLIonSelectElement).value;

    let classList = getSelectedClassList();

    if (!activityTitle) {
      setToastInfo({
        isToastOpen: true,
        toastMsg: "Başlık Girilmelidir",
      });
      return;
    }

    if (multipleActivityCreation && !selectedFinalDate) {
      setToastInfo({
        isToastOpen: true,
        toastMsg: "Son Oluşturma Tarihi Seçiniz",
      });
      return;
    }

    let studentRecordList: StudentRecordDto[] = [];

    let multipleActivity: MultipleAcitivityDto = { items: [] };

    let activityList: ActivityDto[] = [];

    if (selectedClassList && classList.length > 0) {
      const fillActivityList = async () => {
        classList.forEach((clazz) => {
          createStudentRecords((clazz as any)._id).then((studentRecords) => {
            studentRecordList = [...studentRecords];
          });

          if (multipleActivityCreation && activityDateList.length > 0) {
            activityDateList.forEach((date) => {
              const activityInfo = createActivity(
                activityTitle as string,
                activityDetail as string,
                activityNote as string,
                (clazz as any)._id,
                date.toLocaleDateString("tr"),
                studentRecordList
              );
              activityList.push(activityInfo);
            });
          } else {
            let activityInfo;

            if (selectedFinalDate && multipleActivityCreation) {
              activityInfo = createActivity(
                activityTitle as string,
                activityDetail as string,
                activityNote as string,
                (clazz as any)._id,
                selectedFinalDate.toLocaleDateString("tr"),
                studentRecordList
              );
            } else {
              activityInfo = createActivity(
                activityTitle as string,
                activityDetail as string,
                activityNote as string,
                (clazz as any)._id,
                date.toLocaleDateString("tr"),
                studentRecordList
              );
            }

            activityList.push(activityInfo);
          }
        });
      };

      await fillActivityList();

      multipleActivity.items = activityList;

      await api
        .activityControllerCreateActivity(multipleActivity)
        .then((res) => {
          refreshActivityPage(multipleActivity.items);
        })
        .catch((res) => {
          console.log(res.response.data.message);
        });
    }
  };

  const [mealList, setMealList] = useState([""]);

  const createActivity = (
    activityTitle: string,
    activityDetail: string,
    activityNote: string,
    classId: string,
    date: string,
    studentRecordList: StudentRecordDto[]
  ): ActivityDto => {
    let activityStartTime = getDateFromTime(
      (startTimeInput.current as HTMLInputElement).value as string
    );
    let activityEndTime = getDateFromTime(
      (endTimeInput.current as HTMLInputElement).value as string
    );

    const activityInfo: ActivityDto = {
      classId: classId,
      type: selectedType,
      name: String(activityTitle),
      description: activityDetail as string,
      activityNote: String(activityNote),
      date: date,
      studentRecords: studentRecordList,
      //sadece yemek ise yaparız şimdili böle
      studentRecordOptions: AysUtils.getStudentRecordType(selectedType),
      start: activityStartTime,
      end: activityEndTime,
      status: ActivityDtoStatusEnum.Active,
      optionalParticipation: false,
    };

    return activityInfo;
  };

  const createStudentRecords = async (
    classId: string
  ): Promise<StudentRecordDto[]> => {
    let studentRecordList: StudentRecordDto[] = [];

    const result = await classApi
      .classControllerGetClassByClassID(classId)
      .then((res: AxiosResponse) => {
        let studentList: StudentDto[] = res.data.students;
        let recordList: RecordDto[] = [];

        //daha soyut yapılması lazım
        if (selectedType === ActivityDtoTypeEnum.Meal) {
          mealList.map((mealName) => {
            recordList.push({ recordType: mealName, completion: "yemedi" });
          });
        } else if (selectedType === ActivityDtoTypeEnum.Attendance) {
          recordList.push({
            recordType: "Yoklama",
            completion: String(true),
          });
        }

        studentList.map((student) => {
          const record: StudentRecordDto = {
            student: student,
            records: [...recordList],
          };

          studentRecordList.push(record);
        });

        return studentRecordList;
      });

    return result;
  };

  const confirmDate = (selectedDate: string) => {
    if (dateInput.current && selectedDate) {
      dateInput.current.value = new Date(selectedDate).toLocaleDateString("tr");
      setDateTimePickerModalOpen(false);
      setSelectedFinalDate(new Date(selectedDate));
    } else {
      setToastInfo({
        isToastOpen: true,
        toastMsg: "Tarih Seçimi Yapılmalıdır.",
      });
    }
  };

  const getSelectedDate = () => {
    if (dateInput.current && dateInput.current.value) {
      const dateString = dateInput.current.value;
      const dateParts = (dateString as string).split(".");
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[0], 10);

      const date = new Date(year, month, day);
      date.setHours(date.getHours() + hourOffset);

      return date.toISOString();
    }
  };

  // Bunu Dışarı taşı
  //------------------------------Yemek Listesi--------------------------------------

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

  function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    if (event.target.value === defaultStr) {
      setSelectedType(ActivityDtoTypeEnum.Default);
    } else if (event.target.value === attendanceStr) {
      setSelectedType(ActivityDtoTypeEnum.Attendance);
    } else {
      setSelectedType(ActivityDtoTypeEnum.Meal);
    }
  }

  function getTypeRelationedItem(activityType: ActivityDtoTypeEnum) {
    if (activityType === ActivityDtoTypeEnum.Meal) {
      return (
        <IonList>
          {mealList.map((value, index) => (
            <IonItem key={index}>
              <IonInput
                label={index + 1 + "."}
                labelPlacement="start"
                value={value}
                onIonChange={handleInputChange(index)}
                className="creation-meal-list"
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

  //---------------------------------------------------------------------------------

  const close = () => {
    closeModal();

    setTimeout(() => {
      setMultipleActivityCreation(false);
      setSelectedFinalDate(removeHourSection(new Date()));
      if (dayPickerRef.current) {
        dayPickerRef.current.resetDays();
      }
    }, 500);
  };

  const getSelectedClassList = () => {
    let classList: ClassDto[] = [];

    if (classRef.current) {
      classList = classRef.current.value;
    } else {
      classList.push(activeClass);
    }

    return classList;
  };

  const isWideScreen = useMediaQuery({ query: "(min-width:576px" });

  return (
    <IonModal
      isOpen={modalInfo.isCreateModalOpen}
      onWillDismiss={() => {
        setToastInfo({
          isToastOpen: false,
          toastMsg: "",
        });
        close();
      }}
      className="fullscreen-modal"
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-no-padding w100 text-center">
            Etkinlik Oluşturma
          </IonTitle>
          {isWideScreen ? (
            <IonButtons slot="start">
              <IonButton
                color="medium"
                onClick={() => {
                  setToastInfo({
                    isToastOpen: false,
                    toastMsg: "",
                  });
                  close();
                }}
              >
                <IonIcon size="large" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
          ) : (
            <IonButtons slot="end">
              <IonButton
                color="medium"
                onClick={() => {
                  setToastInfo({
                    isToastOpen: false,
                    toastMsg: "",
                  });
                  close();
                }}
              >
                <IonIcon size="large" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false}>
        <div
          style={{ height: "100%" }}
          className=" d-flex justify-content-center"
        >
          <Col
            xs={12}
            sm={7}
            md={6}
            lg={5}
            style={{ height: "100%" }}
            className="border-start border-end p-1"
          >
            <Container fluid className="mt-3">
              <Form>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Başlık</Form.Label>
                      <Form.Control ref={activityTitleInput} type="input" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Tür</Form.Label>
                      <Form.Select defaultValue={AysUtils.convertActivityTypeToEnum(selectedType).toString()} onChange={(e) => handleSelectChange(e)}>
                        <option value={attendanceStr}>{attendanceStr}</option>
                        <option value={defaultStr}>{defaultStr}</option>
                        <option value={mealStr}>{mealStr}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Sınıflar</Form.Label>
                    <IonSelect
                      ref={classRef}
                      className="edit-select"
                      interfaceOptions={{
                        header: "Sınıf",
                      }}
                      cancelText="İptal"
                      okText="Tamam"
                      value={getSelectedClassList()}
                      multiple={true}
                    >
                      {classList.map((clazz, index) => (
                        <IonSelectOption key={index} value={clazz}>
                          {clazz.name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </Form.Group>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Başlangıç Saati</Form.Label>
                      <Form.Control ref={startTimeInput} type="time" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Bitiş Saati</Form.Label>
                      <Form.Control ref={endTimeInput} type="time" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Detay</Form.Label>
                    <Form.Control as="textarea" rows={2} ref={detailInput} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Özel Not</Form.Label>
                    <Form.Control as="textarea" rows={2} ref={noteInput} />
                  </Form.Group>
                </Row>
                <Row>
                  <IonSegment
                    mode="ios"
                    color={`primary`}
                    onIonChange={() =>
                      setMultipleActivityCreation(!multipleActivityCreation)
                    }
                    value={multipleActivityCreation ? "çoklu" : "tekli"}
                  >
                    <IonSegmentButton value="tekli">
                      <IonLabel>Tekli</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="çoklu">
                      <IonLabel>Çoklu</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </Row>
                {getTypeRelationedItem(selectedType)}
                {multipleActivityCreation && (
                  <Row>
                    <DayPickerComponent
                      ref={dayPickerRef}
                      defaultDate={date}
                      selectedDate={selectedFinalDate as Date}
                    />
                    <IonItem onClick={() => setDateTimePickerModalOpen(true)}>
                      <IonInput
                        ref={dateInput}
                        readonly
                        label="Son Oluşturma Tarihi"
                        labelPlacement="stacked"
                        placeholder="GG.AA.YYYY"
                      ></IonInput>
                    </IonItem>
                  </Row>
                )}
              </Form>
            </Container>
          </Col>
        </div>
      </IonContent>
      <DateTimePickerModal
        isModalOpen={dateTimePickerModalOpen}
        setModalOpen={setDateTimePickerModalOpen}
        selectedValue={getSelectedDate()}
        title="Son Oluşturma Tarihi"
        getSelectedDate={confirmDate}
      />
      <IonToast
        isOpen={toastInfo.isToastOpen}
        message={toastInfo.toastMsg}
        color="danger"
        onDidDismiss={() =>
          setToastInfo({
            isToastOpen: false,
            toastMsg: "",
          })
        }
        duration={3000}
      ></IonToast>
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
    </IonModal>
  );
}

export default ActivityCreationModal;
