import { IonContent } from "@ionic/react";
import { useEffect, useState } from "react";
import StudentInfo from "../components/StudentInfoComponents/StudentInfo";
import { StudentApi } from "../../api/api";
import { StudentDto } from "../../api/models";
import { useAppSelector } from "../reducers/hooks";
import { IUser } from "../reducers/userReducer";
import { AYS_BASEPATH } from "../utils/AysConfiguration";

function StudentPage() {
  const userStorage = JSON.parse(
    localStorage.getItem("user") as string
  ) as IUser;

  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  const studentApi = new StudentApi({ basePath: AYS_BASEPATH });
  // const menuRef = useRef<HTMLIonMenuElement>(null);

  const [activeStudent, setActiveStudent] = useState<StudentDto | null>(null);
  const [studentList, setStudentList] = useState<StudentDto[]>(
    [] as StudentDto[]
  );

  useEffect(() => {
    // Fetch student data

    const initData = async () => {
      const response = await studentApi.studentControllerGetStudentByParentID(
        user.id
      );

      let studentList: StudentDto[] = response.data;

      if (studentList && studentList.length > 0) {
        setActiveStudent(studentList[0]);
        setStudentList(studentList);
      }
    };

    initData();
  }, []);

  // const toggleStudent = (student: StudentDto) => {
  //   if (menuRef.current) {
  //     menuRef.current.close();
  //   }
  //   setActiveStudent(student);
  // };

  return (
    <>
      <IonContent forceOverscroll={false}>
        {activeStudent && (
          <StudentInfo
            student={activeStudent}
            role={user.roles[0]}
            isModal={false}
            editMode={false}
          />
        )}
      </IonContent>
      {/* <StudentMenu
        menuRef={menuRef}
        toggleStudent={toggleStudent}
        studentList={studentList}
        activeStudent={activeStudent}
      /> */}
    </>
  );
}

export default StudentPage;
