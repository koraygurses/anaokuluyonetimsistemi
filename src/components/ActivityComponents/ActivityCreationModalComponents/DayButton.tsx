import { IonButton } from "@ionic/react";
import { useState } from "react";
import { Days } from "../../../utils/AysUtils";

interface Props {
    day: Days;
    handleDay: (day: Days, dayFunction: DayFunction) => void;
}

export enum DayFunction {
    Add,
    Remove
}

function DayButton({ day, handleDay }: Props) {

    const [isButtonClicked, setButtonClicked] = useState(false);

    const handleButtonClick = () => {
        setButtonClicked(!isButtonClicked);
        const dayFunc = !isButtonClicked ? DayFunction.Add : DayFunction.Remove;
        handleDay(day, dayFunc);
    };

    return (
        <IonButton style={{ fontSize: '12px' }} className={isButtonClicked ? "day-button-active" : "day-button-inactive"} fill={isButtonClicked ? 'outline' : 'clear'} shape="round" onClick={handleButtonClick}>
            {day}
        </IonButton>
    );
}

export default DayButton;