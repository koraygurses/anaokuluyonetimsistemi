import { IonAvatar, IonChip, IonImg, IonItem, IonLabel } from "@ionic/react";
import { StudentDto } from "../../../api/models";
import { personOutline } from "ionicons/icons";

interface MenuItemProps {
  student: StudentDto;
  onItemClicked: (student: StudentDto) => void;
  chipColor: string
}

function MenuItem({ student, onItemClicked, chipColor }: MenuItemProps) {

  return (
    <IonItem
      className="ays-no-p clickable ion-activatable"
      lines="none"
    >
      <IonChip className="w100" color={chipColor} onClick={() => onItemClicked(student)}>
        <IonAvatar>
          <IonImg src={personOutline} />
        </IonAvatar>
        <IonLabel color="dark">{student.name}</IonLabel>
      </IonChip>
    </IonItem>
  );
}

export default MenuItem;
