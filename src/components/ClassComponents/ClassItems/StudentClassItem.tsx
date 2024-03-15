import { IonAlert, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { RoleEnum } from "../../../utils/enum/RoleEnum";
import { StudentDto } from "../../../../api/models";
import { useAppSelector } from "../../../reducers/hooks";
import { IUser } from "../../../reducers/userReducer";
import { useState } from "react";

interface StudentClassItemProps {
  student: StudentDto;
  isModalOpen: (student: StudentDto) => void;
  deleteStudent: (student: StudentDto) => void;
}

function StudentClassItem({
  student,
  isModalOpen,
  deleteStudent,
}: StudentClassItemProps) {
  const userStorage = JSON.parse(
    localStorage.getItem("user") as string
  ) as IUser;

  const [isAlertOpen, setAlertOpen] = useState(false);

  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  return (
    <>
      <IonItem button detail={false} onClick={() => isModalOpen(student)}>
        <IonLabel>{student.name}</IonLabel>
        {RoleEnum.admin === user.roles[0] && (
          <IonIcon
            onClick={(e) => {
              e.stopPropagation();
              setAlertOpen(true);
            }}
            className="class-item-far-right-btn"
            icon={trashOutline}
          />
        )}
      </IonItem>
      <IonAlert
        isOpen={isAlertOpen}
        message={
          student.name + " İsimli Öğrenciyi Silmek İstediğinizden Emin Misiniz?"
        }
        buttons={[
          {
            text: "Hayır",
            handler: () => {
              setAlertOpen(false);
            },
          },
          {
            text: "Evet",
            handler: () => {
              deleteStudent(student);
            },
          },
        ]}
      />
    </>
  );
}

export default StudentClassItem;
