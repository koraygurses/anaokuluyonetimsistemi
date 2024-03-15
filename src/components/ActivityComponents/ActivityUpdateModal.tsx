import {
  InputChangeEventDetail,
  IonActionSheet,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";
import {
  ActivityDto,
  ActivityDtoTypeEnum,
  UpdateActivityDto,
  UpdateActivityDtoStatusEnum,
  UpdateActivityDtoTypeEnum,
} from "../../../api/models";
import { ActivityApi } from "../../../api/api";
import AysUtils, { getDateFromTime } from "../../utils/AysUtils";
import {
  add,
  removeCircleOutline,
  closeOutline,
  arrowBackOutline,
} from "ionicons/icons";
import React from "react";
import { OverlayEventDetail } from "@ionic/core";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import "../../theme/responsive.css";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

interface ModalEvents {
  isUpdateModalOpen: ActivityDto;
  setUpdateModalOpen: React.Dispatch<React.SetStateAction<ActivityDto>>;
  refreshActivityPage: (
    createdActivityList?: ActivityDto[],
    updatedActivity?: UpdateActivityDto,
    deletedActivityId?: string
  ) => void;
}

function ActivityUpdateModal({
  isUpdateModalOpen,
  setUpdateModalOpen,
  refreshActivityPage,
}: ModalEvents) {
  const api = new ActivityApi({ basePath: AYS_BASEPATH });

  const [isFailToastOpen, setFailToastOpen] = useState({
    isOpen: false,
    message: "",
  });
  const [isActionSheetOpen, setActionSheetOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(
    UpdateActivityDtoTypeEnum.Default
  );
  const [mealList, setMealList] = useState([""]);

  const activityTitleInput = useRef<HTMLInputElement>(null);
  const detailInput = useRef<HTMLTextAreaElement>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const startTimeInput = useRef<HTMLInputElement>(null);
  const endTimeInput = useRef<HTMLInputElement>(null);

  const hourOffset = 3; //Yerel Saat conversion

  const attendanceStr = AysUtils.convertActivityTypeToEnum(
    ActivityDtoTypeEnum.Attendance
  ).toString();

  const mealStr = AysUtils.convertActivityTypeToEnum(
    ActivityDtoTypeEnum.Meal
  ).toString();

  const defaultStr = AysUtils.convertActivityTypeToEnum(
    ActivityDtoTypeEnum.Default
  ).toString();

  function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    if (event.target.value === defaultStr) {
      setSelectedType(UpdateActivityDtoTypeEnum.Default);
    } else if (event.target.value === attendanceStr) {
      setSelectedType(UpdateActivityDtoTypeEnum.Attendance);
    } else {
      setSelectedType(UpdateActivityDtoTypeEnum.Meal);
    }
  }

  const stringToEnumValue = (
    inputString: string
  ): UpdateActivityDtoStatusEnum | undefined => {
    const enumValue = Object.values(UpdateActivityDtoStatusEnum).find(
      (value) => value === inputString
    );

    return enumValue as UpdateActivityDtoStatusEnum | undefined;
  };

  const triggerConfirmEvent = async () => {
    let activityTitle = (activityTitleInput.current as HTMLInputElement).value;
    let activityDetail = (detailInput.current as HTMLTextAreaElement).value;
    let activityNote = (noteInput.current as HTMLTextAreaElement)
      .value as string;
    let activityStartTime = getDateFromTime(
      (startTimeInput.current as HTMLInputElement).value as string
    );
    let activityEndTime = getDateFromTime(
      (endTimeInput.current as HTMLInputElement).value as string
    );

    if (!activityTitle) {
      setFailToastOpen({ isOpen: true, message: "Başlık Girilmelidir" });
      return;
    }

    const activityInfo: UpdateActivityDto = {
      id: (isUpdateModalOpen as any)._id,
      name: String(activityTitle),
      description: activityDetail as string,
      type: selectedType,
      activityNote: String(activityNote),
      date: isUpdateModalOpen.date,
      start: activityStartTime,
      end: activityEndTime,
      optionalParticipation: false,
    };

    await api.activityControllerUpdateActivity(activityInfo).then((res) => {
      // console.log(res);
    });

    refreshActivityPage([], activityInfo);
  };

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

      if ((isUpdateModalOpen as any)._id)
        await api
          .activityControllerDeleteActivity((isUpdateModalOpen as any)._id)
          .catch((request) => {
            // console.log(request.data);
          });

      refreshActivityPage([], undefined, (isUpdateModalOpen as any)._id);
    } else if (action === "cancel") {
      setActionSheetOpen(false);
    }
  };

  const isWideScreen = useMediaQuery({ query: "(min-width:576px" });

  return (
    <IonModal
      mode="ios"
      isOpen={(isUpdateModalOpen as any)._id ? true : false}
      onWillDismiss={() => {
        setFailToastOpen({ isOpen: false, message: "" });
        setUpdateModalOpen({} as ActivityDto);
      }}
      className="fullscreen-modal"
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isUpdateModalOpen.name}</IonTitle>
          {isWideScreen ? (
            <IonButtons slot="start">
              <IonButton
                onClick={() => {
                  setFailToastOpen({ isOpen: false, message: "" });
                  setUpdateModalOpen({} as ActivityDto);
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
                  setUpdateModalOpen({} as ActivityDto);
                }}
                color="medium"
              >
                <IonIcon size="large" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <div
        style={{ height: "100%" }}
        className="d-flex justify-content-center "
      >
        <Col
          xs={12}
          sm={7}
          md={6}
          lg={5}
          style={{ height: "100%" }}
          className="border-start border-end p-1 "
        >
          <Container fluid className=" justify-content-center mt-3">
            <Form>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Başlık</Form.Label>
                    <Form.Control
                      ref={activityTitleInput}
                      type="input"
                      defaultValue={isUpdateModalOpen.name}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Tür</Form.Label>
                    <Form.Select
                      disabled
                      defaultValue={AysUtils.convertActivityTypeToEnum(
                        isUpdateModalOpen.type
                      ).toString()}
                      onChange={(e) => handleSelectChange(e)}
                    >
                      <option value={defaultStr}>{defaultStr}</option>
                      <option value={attendanceStr}>{attendanceStr}</option>
                      <option value={mealStr}>{mealStr}</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Başlangıç Saati</Form.Label>
                    <Form.Control
                      ref={startTimeInput}
                      type="time"
                      defaultValue={
                        isUpdateModalOpen.start
                          ? `${new Date(isUpdateModalOpen.start)
                              .getUTCHours()
                              .toString()
                              .padStart(2, "0")}:${new Date(
                              isUpdateModalOpen.start
                            )
                              .getUTCMinutes()
                              .toString()
                              .padStart(2, "0")}`
                          : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Bitiş Saati</Form.Label>
                    <Form.Control
                      ref={endTimeInput}
                      type="time"
                      defaultValue={
                        isUpdateModalOpen.end
                          ? `${new Date(isUpdateModalOpen.end)
                              .getUTCHours()
                              .toString()
                              .padStart(2, "0")}:${new Date(
                              isUpdateModalOpen.end
                            )
                              .getUTCMinutes()
                              .toString()
                              .padStart(2, "0")}`
                          : ""
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label>Detay</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    defaultValue={isUpdateModalOpen.description}
                    ref={detailInput}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label>Özel Not</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    defaultValue={isUpdateModalOpen.activityNote}
                    ref={noteInput}
                  />
                </Form.Group>
              </Row>
            </Form>
          </Container>
        </Col>
      </div>
      <IonContent forceOverscroll={false}>
        <IonItemGroup>
          {getTypeRelationedItem(selectedType)}
          <IonItem key={`activity-submit`} lines="none"></IonItem>
        </IonItemGroup>
      </IonContent>
      <IonFooter>
        <div className="p-1">
          <Row className="d-flex flex-row justify-content-center">
            <Col
              xs={12}
              sm={8}
              md={6}
              lg={4}
              className="d-flex flex-row justify-content-center"
            >
              <ButtonGroup className="ays-border-none w100">
                <Button
                  className="ays-bgcolor-primary ays-border-none"
                  onClick={triggerConfirmEvent}
                >
                  Onayla
                </Button>
                <Button
                  className="ays-bgcolor-danger ays-border-none"
                  onClick={triggerDeleteEvent}
                >
                  Sil
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

export default ActivityUpdateModal;
