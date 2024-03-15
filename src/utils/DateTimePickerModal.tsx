import {
  IonModal,
  IonToolbar,
  IonTitle,
  IonDatetime,
  IonButtons,
  IonButton,
} from "@ionic/react";
import { useRef, useState } from "react";

interface Props {
  isModalOpen: boolean;
  setModalOpen: (status: boolean) => void;
  title: string;
  selectedValue: string | undefined;
  getSelectedDate: (selectedDate: string) => void;
}

function DateTimePickerModal({
  isModalOpen,
  setModalOpen,
  title,
  selectedValue,
  getSelectedDate,
}: Props) {
  const dateTimeRef = useRef<HTMLIonDatetimeElement>(null);

  const sendSelectedDate = () => {
    const selectedDate = dateTimeRef.current ? (dateTimeRef.current.value as string) : "";
    getSelectedDate(
      selectedDate
    );
  };

  return (
    <IonModal
      isOpen={isModalOpen}
      className="date-modal"
      keepContentsMounted
      onDidDismiss={() => setModalOpen(false)}
    >
      <div style={{ verticalAlign: "top" }}>
        <IonToolbar className="date-modal-title-toolbar">
          <IonTitle className="title">{title}</IonTitle>
        </IonToolbar>
        <IonDatetime
          className="modal-date-background"
          value={selectedValue}
          mode="ios"
          ref={dateTimeRef}
          firstDayOfWeek={1}
          hourCycle="h24"
          presentation="date"
          locale="tr-TR"
          size="cover"
        />
        <IonToolbar className="date-modal-date-toolbar">
          <IonButtons slot="end">
            <IonButton color={"primary"} onClick={() => setModalOpen(false)}>
              İPTAL
            </IonButton>
            <IonButton color={"primary"} onClick={sendSelectedDate}>
              TAMAM
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </div>
    </IonModal>
  );
}

export default DateTimePickerModal;
