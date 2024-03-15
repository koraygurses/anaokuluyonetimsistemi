import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherEventDetail,
  ScrollDetail,
} from "@ionic/react";
import { useEffect, useState } from "react";
import StudentClassItem from "../components/ClassComponents/ClassItems/StudentClassItem";
import StudentInfo from "../components/StudentInfoComponents/StudentInfo";
import { add } from "ionicons/icons";
import { RoleEnum } from "../utils/enum/RoleEnum";
import { ClassApi, StudentApi, TeacherApi } from "../../api/api";
import {
  ClassDto,
  CreateClassDto,
  StudentDto,
  TeacherDto,
} from "../../api/models";
import { AxiosResponse } from "axios";
import { useAppSelector } from "../reducers/hooks";
import { IUser } from "../reducers/userReducer";
import AddStudentModal from "../components/ClassComponents/ClassModals/AddStudentModal";
import TeacherClassItem from "../components/ClassComponents/ClassItems/TeacherClassItem";
import { AYS_BASEPATH } from "../utils/AysConfiguration";

function ClassPage() {
  const classApi = new ClassApi({ basePath: AYS_BASEPATH });
  const teacherApi = new TeacherApi({
    basePath: AYS_BASEPATH,
  });
  const studentApi = new StudentApi({ basePath: AYS_BASEPATH });
  const userStorage = JSON.parse(
    localStorage.getItem("user") as string
  ) as IUser;

  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  const initClassInfo = {
    classList: [] as ClassDto[],
    activeClass: {} as ClassDto,
  };

  const initToastInfo = {
    isToastOpen: false,
    toastMsg: {} as string,
    color: "success",
  };

  const [toastInfo, setToastInfo] = useState(initToastInfo);
  const [classInfo, setClassInfo] = useState(initClassInfo);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [isStudentInfoModalOpen, setStudentInfoModalOpen] = useState(false);
  const [isStudentEditMode, setStudentEditMode] = useState(false);
  const [createStudentModalOpen, setCreateStudentModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState({} as StudentDto);
  const [isAddClassAlertOpen, setAddClassAlertOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fetchedClassList: ClassDto[] = [];

        if (user.roles[0] === RoleEnum.instructor) {
          const teacher = (
            await teacherApi.teacherControllerFindOneByGSM(user.gsm)
          ).data;
          const classResponse =
            await classApi.classControllerGetClassesByTeacherID(
              (teacher as any)._id
            );

          fetchedClassList = classResponse.data;
        } else {
          const response: AxiosResponse<ClassDto[]> =
            await classApi.classControllerFindAll();

          fetchedClassList = response.data;
        }

        if (fetchedClassList.length > 0) {
          let newActiveClass = fetchedClassList.find(
            (clazz) => (clazz as any)._id === (classInfo.activeClass as any)._id
          );

          setClassInfo({
            classList: fetchedClassList,
            activeClass: newActiveClass || fetchedClassList[0],
          });
        }
      } catch (error) {
        // Handle any errors here
      }
    };

    fetchData();

    if (refreshFlag) {
      setRefreshFlag(false);
    }
  }, [
    refreshFlag,
    isAddClassAlertOpen,
    createStudentModalOpen,
    isStudentInfoModalOpen,
    isStudentEditMode,
  ]);

  const closeCreateStudentModal = (toastInfo: {
    isToastOpen: boolean;
    toastMsg: string;
    color: string;
  }) => {
    setCreateStudentModalOpen(false);
    setToastInfo(toastInfo);
  };

  function refreshPage(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      setRefreshFlag(true);
      event.detail.complete();
    }, 1200);
  }

  const confirmStudentEdit = async () => {
    let response = await studentApi.studentControllerGetStudentByObjectID(
      (activeStudent as any)._id
    );
    let newActiveStudent = response.data;

    //TODO buraya id verilecek en kötü
    setStudentEditMode(false);
    setActiveStudent(newActiveStudent);
  };

  const addClass = async (className: string) => {
    if (className.length < 1) {
      setToastInfo({
        isToastOpen: true,
        toastMsg: "Lütfen Sınıf Adı Giriniz",
        color: "danger",
      });
      return false;
    } else {
      let newClass: CreateClassDto = {
        name: className,
      };
      try {
        await classApi
          .classControllerCreate(newClass)
          .then((res) => {
            setToastInfo({
              isToastOpen: true,
              toastMsg: className + " Sınıfı Başarıyla Oluşturulmuştur",
              color: "success",
            });

            setAddClassAlertOpen(false);

            return true;
          })
          .catch((res) => {
            setToastInfo({
              isToastOpen: true,
              toastMsg: "Sınıf Oluşturulurken Hata Oluştu",
              color: "danger",
            });

            return false;
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const deleteStudent = async (student: StudentDto) => {
    await studentApi.studentControllerDeleteStudent((student as any)._id);
    setRefreshFlag(true);
  };

  const openStudentProfile = (activeStudent: StudentDto) => {
    setActiveStudent(activeStudent);
    setStudentInfoModalOpen(true);
  };

  const closeModal = () => {
    setStudentEditMode(false);
    setStudentInfoModalOpen(false);
  };

  const handleSearchChange = (event: CustomEvent) => {
    setSearchText(event.detail.value);
  };

  const handleSelectChange = (event: CustomEvent) => {
    setClassInfo({
      classList: classInfo.classList,
      activeClass: event.detail.value,
    });
  };

  function handleScrollStart() {}

  function handleScroll(ev: CustomEvent<ScrollDetail>) {}

  function handleScrollEnd() {}

  return (
    <>
      <IonContent
        forceOverscroll={false}
        scrollEvents={true}
        onIonScrollStart={handleScrollStart}
        onIonScroll={handleScroll}
        onIonScrollEnd={handleScrollEnd}
        fullscreen={true}
        className="ays-bg-light-tint"
      >
        <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="ays-p16">
              {classInfo.activeClass.name
                ? classInfo.activeClass.name + " Sınıfı"
                : "Sınıf Sayfası"}
            </IonTitle>
          </IonToolbar>
          <IonGrid className="ays-no-p">
            <IonRow className="center-select">
              <IonCol>
                <IonSelect
                  cancelText="İptal"
                  okText="Tamam"
                  className="class-page-select"
                  label="Sınıf Seçimi"
                  onIonChange={(event: CustomEvent) =>
                    handleSelectChange(event)
                  }
                  placeholder="Sınıf Seç"
                  value={classInfo.activeClass}
                >
                  {classInfo.classList.map((clazz, index) => (
                    <IonSelectOption key={index} value={clazz}>
                      {clazz.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonCol>
              {RoleEnum.admin === user.roles[0] && (
                <IonButton
                  fill="clear"
                  color="primary"
                  size="small"
                  onClick={() => setAddClassAlertOpen(true)}
                >
                  <IonIcon slot="start" icon={add} />
                </IonButton>
              )}
            </IonRow>
            <IonRow className="center-search">
              <IonCol>
                <IonSearchbar
                  value={searchText}
                  onIonInput={handleSearchChange}
                  className="class-page-searchbar"
                  placeholder="Öğrenci Ara"
                ></IonSearchbar>
              </IonCol>
              {RoleEnum.admin === user.roles[0] && (
                <IonButton
                  fill="clear"
                  color="primary"
                  size="small"
                  onClick={() => setCreateStudentModalOpen(true)}
                >
                  <IonIcon slot="start" icon={add} />
                </IonButton>
              )}
            </IonRow>
          </IonGrid>
        </IonHeader>
        {classInfo.activeClass.teachers &&
          classInfo.activeClass.teachers.map(
            (teacher: TeacherDto, index: number) => (
              <TeacherClassItem key={index} teacher={teacher} />
            )
          )}
        {classInfo.activeClass.students &&
          classInfo.activeClass.students
            .filter((student: StudentDto) => {
              // Burada öğrenci adını ve/veya diğer bilgilerini filtreleme kriteri olarak kullanabilirsiniz.
              // Örneğin, öğrencinin adı veya soyadı arama metni ile başlıyorsa:
              return student.name
                .toLowerCase()
                .includes(searchText.toLowerCase());
            })
            .map((student: StudentDto, index: number) => (
              <StudentClassItem
                key={index}
                student={student}
                isModalOpen={openStudentProfile}
                deleteStudent={deleteStudent}
              />
            ))}
      </IonContent>
      <IonModal
        isOpen={isStudentInfoModalOpen}
        onDidDismiss={closeModal}
        className="fullscreen-modal"
      >
        {/* TODO bu design hoşuma gitmedi (activeClass verme olayı) */}
        <StudentInfo
          student={activeStudent}
          studentClazz={classInfo.activeClass}
          role={user.roles[0]}
          isModal={isStudentInfoModalOpen}
          closeModal={closeModal}
          editMode={isStudentEditMode}
          setEditMode={setStudentEditMode}
          confirmEdit={confirmStudentEdit}
        />
      </IonModal>

      {RoleEnum.admin === user.roles[0] && (
        <>
          {/* <IonFab
            onClick={() => setCreateStudentModalOpen(true)}
            slot="fixed"
            vertical="bottom"
            horizontal="end"
            color="primary"
          >
            <IonFabButton>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab> */}
          <AddStudentModal
            classInfo={classInfo}
            isModalOpen={createStudentModalOpen}
            closeModal={closeCreateStudentModal}
          />
          <IonAlert
            isOpen={isAddClassAlertOpen}
            onWillDismiss={() => setAddClassAlertOpen(false)}
            header="Sınıf Ekle"
            inputs={[
              {
                name: "className",
                type: "text",
                placeholder: "Eklenecek Sınıfın İsmi",
              },
            ]}
            buttons={[
              {
                text: "İptal",
                handler: () => {
                  setAddClassAlertOpen(false);
                },
              },
              {
                text: "Evet",
                handler: (result) => {
                  return addClass(result.className);
                },
              },
            ]}
          ></IonAlert>
          <IonToast
            isOpen={toastInfo.isToastOpen}
            message={toastInfo.toastMsg}
            color={toastInfo.color}
            onDidDismiss={() => setToastInfo(initToastInfo)}
            duration={1600}
          ></IonToast>
        </>
      )}
    </>
  );
}

export default ClassPage;
