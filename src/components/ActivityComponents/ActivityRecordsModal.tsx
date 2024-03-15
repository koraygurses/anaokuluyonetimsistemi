import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
} from "@ionic/react";
import { closeOutline, arrowBackOutline } from "ionicons/icons";
import {
  ActivityDto,
  ActivityDtoTypeEnum,
  StudentDto,
  StudentRecordDto,
} from "../../../api/models";
import ActivityItemRecord from "./ActivityItemRecord";
import { useMediaQuery } from "react-responsive";

interface Props {
  className: string;
  activityList: ActivityDto[];
  isModalOpen: boolean;
  closeModal: () => void;
}

function ActivityRecordsModal(props: Props) {
  const checkNote = (activity: ActivityDto) => {
    return (activity.studentRecords as StudentRecordDto[]).filter((record) => {
      if (record.note) {
        return true;
      }
    });
  };

  const isWideScreen = useMediaQuery({ query: "(min-width:620px" });

  return (
    <IonModal
      isOpen={props.isModalOpen}
      onDidDismiss={props.closeModal}
      className="fullscreen-modal"
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ays-no-p text-center">
            {props.className} Günlük Özet
          </IonTitle>
          {isWideScreen ? (
            <IonButtons slot="start">
              <IonButton
                onClick={() => {
                  props.closeModal();
                }}
                color={"medium"}
              >
                <IonIcon size="large" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
          ) : (
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  props.closeModal();
                }}
                color={"medium"}
              >
                <IonIcon size="large" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent forceOverscroll={false}>
        {/* burda recordları birleşitirip öğrenci için her kayıdı bir başlık altında yaparız ama şimdi yapmıcam banane */}
        {props.activityList.map((activity, index) => {
          if (
            activity.type !== ActivityDtoTypeEnum.Default ||
            (checkNote(activity).length as number) > 0
          ) {
            return (
              <IonCard key={(activity as any)._id}>
                <IonCardHeader>
                  <IonTitle size="large">{activity.name}</IonTitle>
                </IonCardHeader>
                <IonCardContent>
                  <ActivityItemRecord
                    students={
                      (activity.studentRecords as StudentRecordDto[]).map(
                        (record) => {
                          return record.student;
                        }
                      ) as StudentDto[]
                    }
                    activity={activity}
                  />
                </IonCardContent>
              </IonCard>
            );
          }
        })}
      </IonContent>
    </IonModal>
  );
}

export default ActivityRecordsModal;
