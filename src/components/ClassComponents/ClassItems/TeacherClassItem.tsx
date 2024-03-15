import { IonItem, IonLabel } from "@ionic/react";
import { TeacherDto } from "../../../../api/models";
import { useAppSelector } from "../../../reducers/hooks";
import { IUser } from "../../../reducers/userReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";

interface ClassItemProps {
  teacher: TeacherDto;
}

function StudentClassItem({ teacher }: ClassItemProps) {
  const userStorage = JSON.parse(
    localStorage.getItem("user") as string
  ) as IUser;

  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  return (
    <IonItem>
      <IonLabel>
        <FontAwesomeIcon
          className="teacher-class-icon-padding"
          icon={faChalkboardTeacher}
        />
        {teacher.name}
      </IonLabel>
    </IonItem>
  );
}

export default StudentClassItem;
