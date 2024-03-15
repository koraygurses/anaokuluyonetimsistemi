import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonTitle,
  IonRow,
  IonCol,
  IonLabel,
  IonRippleEffect,
} from "@ionic/react";
import {
  ActivityDto,
  ActivityDtoStatusEnum,
  ActivityDtoTypeEnum,
  StudentDto,
} from "../../../api/models";
import { useAppSelector } from "../../reducers/hooks";
import { IUser } from "../../reducers/userReducer";
import {
  faClipboardUser,
  faPenNib,
  faPenToSquare,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RoleEnum } from "../../utils/enum/RoleEnum";
import ActivityItemRecord from "./ActivityItemRecord";

interface ActivityItemProps {
  activity: ActivityDto;
  studentsOfParent?: StudentDto[];
  setRecordUpdateModalOpen: React.Dispatch<React.SetStateAction<ActivityDto>>;
  setUpdateModalOpen: React.Dispatch<React.SetStateAction<ActivityDto>>;
}

export function ActivityItem(props: ActivityItemProps) {
  const userStorage = JSON.parse(
    localStorage.getItem("user") as string
  ) as IUser;

  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  const getDateString = (date: Date) => {
    return (
      ("0" + date.getUTCHours()).slice(-2) +
      ":" +
      ("0" + date.getUTCMinutes()).slice(-2)
    );
  };

  const getBorderColor = (status: ActivityDtoStatusEnum) => {
    if (ActivityDtoStatusEnum.Planned === status) {
      return "border-left-todo";
    } else if (ActivityDtoStatusEnum.Completed === status) {
      return "border-left-success";
    } else if (ActivityDtoStatusEnum.Active === status) {
      return "border-left-primary";
    } else {
      return "border-left-danger";
    }
  };

  return (
    <IonCard className="ays-mv5 ays-mh10 ays-no-shadow" mode="ios">
      <IonRow>
        <IonCol
          size="12"
          className={`${getBorderColor(props.activity.status)} pb-0`}
        >
          <IonCardHeader
            className="ion-justify-content-start ays-p10"
            color="inherit"
          >
            <IonCardTitle>
              <div className="d-flex flex-row justify-content-between p-0 ays-bold">
                <div
                  style={{ fontSize: "20px" }}
                  className="text-start ays-color-dark"
                >
                  {props.activity.name}
                  {props.activity.type === ActivityDtoTypeEnum.Meal && (
                    <FontAwesomeIcon
                      className="ps-1 ays-color-danger"
                      size="sm"
                      color="warning"
                      icon={faUtensils}
                    />
                  )}
                  {props.activity.type === ActivityDtoTypeEnum.Attendance && (
                    <FontAwesomeIcon
                      className="ps-1 ays-color-warning"
                      size="sm"
                      color="danger"
                      icon={faClipboardUser}
                    />
                  )}
                </div>
                <div color="medium" className="text-nowrap hour-label ">
                  {getDateString(new Date(props.activity.start)) +
                    " - " +
                    getDateString(new Date(props.activity.end))}
                </div>
              </div>

              {props.activity.description && (
                <IonRow>
                  <IonLabel
                    color="dark-tint"
                    style={{ fontSize: "14px" }}
                    className="ays-mt7 text-start"
                  >
                    {props.activity.description}
                  </IonLabel>
                </IonRow>
              )}
              {props.activity.activityNote && (
                <IonRow>
                  <IonLabel
                    color="dusk"
                    style={{ fontSize: "12px" }}
                    className="mt-1 text-start"
                  >
                    {props.activity.activityNote}
                  </IonLabel>
                </IonRow>
              )}

              <IonRow></IonRow>
            </IonCardTitle>
          </IonCardHeader>
          {user.roles[0] !== "parent" && (
            <div className="d-flex flex-row justify-content-end border-top ion-activatable">
              <div
                className="p-1 m-1"
                onClick={() =>
                  user.roles[0] !== RoleEnum.parent &&
                  props.setRecordUpdateModalOpen(props.activity)
                }
              >
                <FontAwesomeIcon
                  className="ays-color-tertiary"
                  size="lg"
                  color="primary"
                  icon={faPenNib}
                />{" "}
                Kayıtlar
              </div>
              <div
                className="p-1 m-1 "
                onClick={() =>
                  user.roles[0] !== RoleEnum.parent &&
                  props.setUpdateModalOpen(props.activity)
                }
              >
                <FontAwesomeIcon
                  className="ays-color-tertiary"
                  size="lg"
                  color="primary"
                  icon={faPenToSquare}
                />{" "}
                Güncelle
              </div>
            </div>
          )}
          <ActivityItemRecord
            activity={props.activity}
            students={props.studentsOfParent as StudentDto[]}
          />
        </IonCol>
      </IonRow>
    </IonCard>
  );
}
