import {
  IonLabel, IonMenuButton, IonRippleEffect
} from "@ionic/react";
import DateTimePickerModal from "../../utils/DateTimePickerModal";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ActivityViewChooser from "./ActivityViewChooser";

interface Props {
  activityDate: Date;
  onDateChange: (newDate: Date) => void;
}

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function ActivityPageHeader({ activityDate, onDateChange }: Props) {

  const [datePickerModalOpen, setPickerModalOpen] = useState(false);
  const [lastSelectedDate, setLastSelectedDate] = useState(activityDate);

  const wideScreenWidth = useMediaQuery({ query: '(min-width:768px' })

  useEffect(() => {
    if (datePickerModalOpen) {
      setLastSelectedDate(activityDate);
    }
  }, [datePickerModalOpen])

  const dateRef = useRef<HTMLDivElement | null>(null);
  const dateLabelRef = useRef<HTMLIonLabelElement | null>(null);

  const getOffsetAddedDate = () => {
    const updatedDate = new Date(lastSelectedDate);
    updatedDate.setHours(lastSelectedDate.getHours() + 3);
    return updatedDate.toISOString();
  }

  const confirmDate = (selectedDate: string) => {
    setPickerModalOpen(false);
    setLastSelectedDate(new Date(selectedDate));
    onDateChange(new Date(selectedDate));
  };

  const getDateStr = (date: Date) => {

    return date.getDate() +
      " " +
      monthNames[date.getMonth()] +
      " " +
      date.getFullYear();
  }

  //wide screen ise butonlar olarak gözükecek eğer değilse, menü butonu olarak gözükecek
  //style={{ borderBottom: '1px solid blue' }}
  const getActivityViewChooser = () => {
    if (wideScreenWidth) {
      return (
        <ActivityViewChooser />
      )
    } else {
      return (
        <IonMenuButton style={{ paddingLeft: '6px', position: 'absolute' }} color="dark" />
      )
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        paddingTop: '16px',
        paddingBottom: '16px',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {getActivityViewChooser()}
      <div
        className="date-component shadow-medium ion-activatable"
        onClick={() => setPickerModalOpen(true)}
        style={{
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        <div ref={dateRef} className="date-label-container">
          <IonLabel ref={dateLabelRef}>
            {getDateStr(activityDate)}
          </IonLabel>
        </div>
        <IonRippleEffect></IonRippleEffect>
      </div>
      <DateTimePickerModal
        isModalOpen={datePickerModalOpen}
        setModalOpen={setPickerModalOpen}
        selectedValue={getOffsetAddedDate()}
        title="Aktivite Tarihi"
        getSelectedDate={confirmDate}
      />
    </div>
  );
}

export default ActivityPageHeader;
