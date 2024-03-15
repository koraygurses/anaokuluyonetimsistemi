import { IonGrid, IonRow, IonCol, IonLabel } from "@ionic/react";
import DayButton, { DayFunction } from "./DayButton";
import { Days, Months } from "../../../utils/AysUtils";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Props {
  defaultDate: Date;
  selectedDate?: Date;
}

const dayList = Object.values(Days);
const monthList = Object.values(Months);

export interface ActivityCreationDayPicker {
  getClickedDayList: () => Days[];
  resetDays: () => void;
}

const DayPickerComponent = forwardRef<ActivityCreationDayPicker, Props>(
  ({
    defaultDate,
    selectedDate,
  }, ref) => {

    const [clickedDayList, setClickedDayList] = useState<Days[]>([]);

    const handleDays = (day: Days, dayFunc: DayFunction) => {
      let updatedDayList = [...clickedDayList];

      if (DayFunction.Remove === dayFunc) {
        updatedDayList = clickedDayList.filter(
          (clickedDay) => clickedDay !== day
        );
      } else {
        updatedDayList.push(day);
      }

      updatedDayList.sort((a, b) => dayList.indexOf(a) - dayList.indexOf(b));

      setClickedDayList(updatedDayList);
    };

    const cycleButtonPosition = (index: number) => {
      if (index === 0) {
        return "end-button-container";
      } else if (index === 1) {
        return "center-button-container";
      } else {
        return "start-button-container";
      }
    };

    const getClickedDays = () => {
      const idleDay = selectedDate ? selectedDate : defaultDate;

      let result: string = "";

      if (clickedDayList.length === dayList.length) {
        result = "Her Gün";
      } else if (clickedDayList.length > 0) {
        result = "Her " + clickedDayList.join(",");
      } else {
        let dayIndex = idleDay.getDay();
        dayIndex = dayIndex - 1;
        if (dayIndex < 0) {
          dayIndex = 6;
        }
        const dayName = dayList[dayIndex];
        const monthName = monthList[idleDay.getMonth()];
        result = dayName + ", " + idleDay.getDate() + " " + monthName;
      }

      return result;
    };

    useImperativeHandle(ref, () => ({
      getClickedDayList: () => {
        return clickedDayList;
      },
      resetDays: () => {
        setClickedDayList([]);
      }
    }))

    return (
      <IonGrid>
        <IonRow className="ays-p16">
          <IonLabel>{getClickedDays()}</IonLabel>
        </IonRow>
        <IonRow>
          {dayList.slice(0, 4).map((day, index) => (
            <IonCol className="center-button-container" size="3" key={index}>
              <DayButton day={day} handleDay={handleDays} />
            </IonCol>
          ))}
        </IonRow>
        <IonRow>
          {dayList.slice(4).map((day, index) => (
            <IonCol className={cycleButtonPosition(index)} size="4" key={index}>
              <DayButton day={day} handleDay={handleDays} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    );
  }
);

export default DayPickerComponent;
