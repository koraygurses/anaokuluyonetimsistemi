import {
  IonMenu,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonList,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { StudentDto } from "../../../api/models";
import MenuItem from "./MenuItem";

interface MenuProps {
  toggleStudent: (student: StudentDto) => void;
  activeStudent: StudentDto | null
  studentList: StudentDto[];
  menuRef: React.Ref<HTMLIonMenuElement>
}

function StudentMenu({ toggleStudent, activeStudent, studentList, menuRef }: MenuProps) {

  const toggleActiveStudent = (student: StudentDto) => {

    if (activeStudent && (activeStudent as any)._id === (student as any)._id) {

      return;
    }

    toggleStudent(student);
  };

  return (
    <IonMenu ref={menuRef} contentId="menu-content" side="end">
      <IonContent forceOverscroll={false}>
        <IonToolbar>
          <IonTitle color="dark">Aktif Öğrenci</IonTitle>
        </IonToolbar>
        {activeStudent && <MenuItem
          student={activeStudent}
          onItemClicked={toggleActiveStudent}
          chipColor="primary"
        />}
        <IonCard className="rounded-card">
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: "18px" }} color="dark">Diğer Öğrenciler</IonCardTitle>
          </IonCardHeader>
          <IonList>
            {studentList.map((student, index) => (
              (activeStudent as any)._id !== (student as any)._id &&
              <MenuItem
                key={index}
                student={student}
                onItemClicked={toggleActiveStudent}
                chipColor=""
              />
            ))}
          </IonList>
        </IonCard>
      </IonContent>
    </IonMenu>
  );
}

export default StudentMenu;
