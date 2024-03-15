import {
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
} from "@ionic/react";
import { useState } from "react";

interface Props {
  onStartTimeChange: (date: Date) => void;
  onEndTimeChange: (date: Date) => void;
  initStartTime?: Date;
  initEndTime?: Date;
}

const hourOffset = 3;

//sildim tam silicem
function StartEndTimePicker({
  onStartTimeChange,
  onEndTimeChange,
  initStartTime,
  initEndTime,
}: Props) {
  const startTimeChanged = (e: CustomEvent) => {
    const selectedTime = e.detail.value;
    const selectedDate = new Date(selectedTime);
    selectedDate.setHours(selectedDate.getHours() + hourOffset);
    onStartTimeChange(selectedDate);
  };

  const endTimeChanged = (e: CustomEvent) => {
    const selectedTime = e.detail.value;
    const selectedDate = new Date(selectedTime);
    selectedDate.setHours(selectedDate.getHours() + hourOffset);
    onEndTimeChange(selectedDate);
  };

  return (
    <IonGrid>
      {/* <IonRow>
        <IonCol size="6" className="border-right">
          <IonRow className="activity-cancel-modal-row-style ays-pb16">
            <IonLabel>Başlangıç Saati</IonLabel>
          </IonRow>
          <IonRow className="activity-cancel-modal-row-style">
            <IonDatetimeButton datetime="startTime"></IonDatetimeButton>
            <IonModal keepContentsMounted={true}>
              <IonDatetime
                // kesin bozuldu bunlar
                value={
                  (initStartTime as Date).toISOString() ||
                  new Date().toISOString()
                }
                presentation="time"
                id="startTime"
                hourCycle="h23"
                onIonChange={startTimeChanged}
              ></IonDatetime>
            </IonModal>
          </IonRow>
        </IonCol>
        <IonCol size="6">
          <IonRow className="activity-cancel-modal-row-style ays-pb16">
            <IonLabel>Bitiş Saati</IonLabel>
          </IonRow>
          <IonRow className="activity-cancel-modal-row-style">
            <IonDatetimeButton datetime="endTime"></IonDatetimeButton>
            <IonModal keepContentsMounted={true}>
              <IonDatetime
                // kesin bozuldu bunlar
                value={
                  (initEndTime as Date).toISOString() ||
                  new Date().toISOString()
                }
                presentation="time"
                id="endTime"
                hourCycle="h23"
                onIonChange={endTimeChanged}
              ></IonDatetime>
            </IonModal>
          </IonRow>
        </IonCol>
      </IonRow> */}
    </IonGrid>
  );
}

export default StartEndTimePicker;
