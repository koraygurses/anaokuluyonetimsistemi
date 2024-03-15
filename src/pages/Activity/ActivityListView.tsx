import {
  IonContent,
  IonRow,
  IonCol,
  IonButton,
  IonButtons,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonTitle,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import { ActivityItem } from "../../components/ActivityComponents/ActivityItem";
import { useState } from "react";
import { ActivityDto, StudentDto } from "../../../api/models";
import { SetStateAction } from "react";
import { RoleEnum } from "../../utils/enum/RoleEnum";
import { useAppSelector } from "../../reducers/hooks";
import { IUser } from "../../reducers/userReducer";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "swiper/css/effect-fade";
import "@ionic/react/css/ionic-swiper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClipboard,
  faFaceFrownOpen,
  faSadTear,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  activityList: ActivityDto[];
  studentsOfParent?: StudentDto[];
  refreshPage: (event: CustomEvent<RefresherEventDetail>) => void;
  setRecordUpdateModalOpen: React.Dispatch<React.SetStateAction<ActivityDto>>;
  setUpdateModalOpen: React.Dispatch<React.SetStateAction<ActivityDto>>;
  setRecordsOpen: React.Dispatch<SetStateAction<boolean>>;
}

const initToastInfo = {
  isToastOpen: false,
  toastMsg: {} as string,
};

const toastInfoNoActivity = {
  isToastOpen: true,
  toastMsg: "Bülten için etkinlik bulunmamaktadır" as string,
};

function ActivityListView({
  activityList,
  studentsOfParent,
  refreshPage,
  setRecordUpdateModalOpen,
  setUpdateModalOpen,
  setRecordsOpen,
}: Props) {
  //local storage
  const userStorage = JSON.parse(
    localStorage.getItem("user") as string
  ) as IUser;

  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  const [toastInfo, setToastInfo] = useState(initToastInfo);

  const toggleRecordsOpen = (isOpen: boolean) => {
    if (activityList.length > 0 && activityList) {
      setRecordsOpen(isOpen);
    } else {
      setToastInfo(toastInfoNoActivity);
    }
  };
  // const dummyReminders = [
  //   {
  //     type: "Etkinlik",
  //     title: "Fotoğraf günü",
  //     text: "Kameraya çiçek olma zamanı",
  //     bgColor: "tertiary",
  //     faIcon: faCamera,
  //   },
  //   {
  //     type: "Hatırlatıcı",
  //     title: "Yangın Tatbikatı",
  //     text: "İtfaiyeciler bizi ziyarete gelicek",
  //     bgColor: "danger",
  //     faIcon: faCamera,
  //   },
  // ];

  // if (date.toLocaleDateString("tr") === "10.12.2023")
  //   dummyReminders.push({
  //     type: "Etkinlik",
  //     title: " Ecem'in Doğum günü",
  //     text: "Kutlamalar öğlen başlıyor",
  //     bgColor: "pink",
  //     faIcon: faBirthdayCake,
  //   });
  // dummyReminders.reverse();
  return (
    <IonContent
      className="ion-content ays-bg-light-tint"
      scrollEvents={true}
      fullscreen={true}
    >
      <IonRefresher
        slot="fixed"
        pullFactor={0.3}
        pullMin={80}
        pullMax={240}
        onIonRefresh={refreshPage}
      >
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      {/* <Carousel style={{ height: "200px" }} controls={false}>
        {dummyReminders.map((reminder) => (
          <Carousel.Item key={reminder.title.toLocaleLowerCase("tr").trim()}>
            <IonCard
              style={{ height: "160px" }}
              mode="ios"
              color={reminder.bgColor}
            >
              <IonCardHeader className="ion-no-padding text-center ays-pt15 ays-pb5">
                <IonCardTitle color={`primary`}>
                  {reminder.title}
                  <FontAwesomeIcon
                    className="ays-ml5"
                    color={`tertiary`}
                    icon={reminder.faIcon}
                  />
                </IonCardTitle>
                <IonCardSubtitle color={`secondary`} className="ion-no-padding">
                  {reminder.type}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent
                // style={{ height: "100%" }}
                className="ion-no-padding text-center my-auto"
              >
                {reminder.text}
              </IonCardContent>
            </IonCard>
          </Carousel.Item>
        ))}
      </Carousel> */}

      {activityList.length === 0 && (
        <IonCard color={`danger`} className="ays-m10 ays-no-shadow " mode="ios">
          <IonRow>
            <IonCol size="12">
              <IonCardHeader className="ion-no-padding" color="inherit">
                <IonCardTitle>
                  <IonRow className="w100 ays-deadcenter ays-ph10">
                    <IonCol
                      size="1"
                      className="ion-no-padding ays-deadcenter w100 ays-color-light"
                    >
                      <FontAwesomeIcon size="lg" icon={faFaceFrownOpen} />
                    </IonCol>
                    <IonCol size="10" className="ays-mt5 ion-no-padding">
                      <div className="ays-card-placeholder">
                        Bugün için Etkinlik bulunmamaktadır.
                      </div>
                    </IonCol>
                    <IonCol size="1" className="ion-no-padding ays-color-light">
                      <FontAwesomeIcon size="lg" icon={faSadTear} />
                    </IonCol>
                  </IonRow>
                </IonCardTitle>
              </IonCardHeader>
            </IonCol>
          </IonRow>
        </IonCard>
      )}
      {activityList.map((activity) => (
        <IonRow key={(activity as any)._id} className={`px-1`}>
          <IonCol
            key={activity.id}
            className="ays-no-p"
            size="12"
            sizeLg="8"
            offsetLg="2"
            sizeXl="6"
            offsetXl="3"
          >
            <ActivityItem
              activity={activity}
              studentsOfParent={studentsOfParent}
              setRecordUpdateModalOpen={setRecordUpdateModalOpen}
              setUpdateModalOpen={setUpdateModalOpen}
            />
          </IonCol>
        </IonRow>
      ))}
      {activityList &&
        activityList.length > 0 &&
        user.roles[0] !== RoleEnum.parent && (
          <IonRow>
            <IonCol>
              <IonButtons className="activity-day-page-btn-container">
                <IonButton
                  className="activity-day-page-btn-end"
                  color={"primary"}
                  shape="round"
                  fill="solid"
                  onClick={() => toggleRecordsOpen(true)}
                >
                  <FontAwesomeIcon
                    className="ays-mr6 ays-mb2"
                    icon={faClipboard}
                  />
                  Günün Özeti
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
        )}
      {activityList.length > 0 && (
        <div className="w100" style={{ height: "165px" }}></div>
      )}
      <IonToast
        isOpen={toastInfo.isToastOpen}
        message={toastInfo.toastMsg}
        color="danger"
        onDidDismiss={() => setToastInfo(initToastInfo)}
        duration={1000}
      ></IonToast>
    </IonContent>
  );
}

export default ActivityListView;
