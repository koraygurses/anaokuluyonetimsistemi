import {
  IonCardHeader,
  IonCardSubtitle,
  IonBadge,
  IonRange,
  IonCardTitle,
  IonNote,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import AysUtils from "../../utils/AysUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";

interface Props {
  keykey: string;
  mealName: string;
  refref: React.Ref<HTMLIonRangeElement>;
  min: number;
  max: number;
  value: number;
  recordOptions: string[];
}

const colorIndex = ["danger", "warning", "success"];

function ActivityMeal(props: Props) {
  const [thumbValue, setThumbValue] = useState<number>(props.value);

  const getPinString = (value: number) => {
    return AysUtils.capitalizeFirstLetter(props.recordOptions[value] as string);
  };

  useEffect(() => {}, [props.refref]);

  // ----------------------------------------------------------------------------

  return (
    <div key={props.keykey}>
      <div>
        <IonNote className=" ays-fs-16" color="primary ">
          <FontAwesomeIcon
            className={`ays-pr5 ays-color-${colorIndex[thumbValue]}`}
            size="lg"
            icon={faBowlFood}
          />
          {props.mealName}
        </IonNote>
        <IonBadge
          style={{ fontWeight: "normal" }}
          className="ms-2"
          color={colorIndex[thumbValue]}
        >
          {getPinString(thumbValue)}
        </IonBadge>
      </div>
      {/* <Form.Range
        className="ays-range-meal bg-primary"
        min={props.min}
        max={props.max}
        defaultValue={thumbValue + 1}
        onChange={(event) => console.log(event)}
      /> */}
      <IonRange
        className="mx-3"
        aria-label="Range with ticks"
        ref={props.refref}
        ticks={true}
        snaps={true}
        min={props.min}
        max={props.max}
        value={thumbValue + 1}
        color={colorIndex[thumbValue]}
        onIonKnobMoveStart={(event) => setThumbValue(+event.target.value - 1)}
        onIonKnobMoveEnd={(event) => setThumbValue(+event.target.value - 1)}
        onIonChange={(event) => setThumbValue(+event.target.value - 1)}
      ></IonRange>
    </div>
  );
}

export default ActivityMeal;
