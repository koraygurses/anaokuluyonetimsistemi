import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClassDto, TeacherDto } from "../../api/models";
import { ClassApi, TeacherApi } from "../../api/api";
import AddTeacherModal from "../components/TeacherComponents/AddTeacherModal";
import TeacherInfo from "../components/TeacherComponents/TeacherInfo";
import TeacherListItem from "../components/TeacherComponents/TeacherListItem";
import { AYS_BASEPATH } from "../utils/AysConfiguration";

function TeacherPage() {
  const teacherApi = new TeacherApi({ basePath: AYS_BASEPATH });
  const classApi = new ClassApi({ basePath: AYS_BASEPATH });

  const initToastInfo = {
    isToastOpen: false,
    toastMsg: {} as string,
    color: "success",
  };

  const [toastInfo, setToastInfo] = useState(initToastInfo);

  const [teacherList, setTeacherList] = useState([] as TeacherDto[]);
  const [classList, setClassList] = useState<ClassDto[]>();
  const [createTeacherModalOpen, setCreateTeacherModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [activeTeacher, setActiveTeacher] = useState({} as TeacherDto);
  const [filteredSearch, setFilteredSearch] = useState([] as TeacherDto[]);
  const [searchQuery, setSearchQuery] = useState("");

  useMemo(() => {
    const getAllClasses = async () => {
      try {
        const response = await classApi.classControllerFindAll();
        setClassList(response.data);
      } catch (error) {}
    };

    getAllClasses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await teacherApi.teacherControllerFindAll();
        const teachers = response.data;

        const activeTeacherFound = teachers.find(
          (teacher) => (teacher as any)._id === (activeTeacher as any)._id
        );

        setTeacherList(teachers);
        if (searchQuery && searchQuery.length > 0) {
          console.log(searchQuery);
          let tempSearchResult: TeacherDto[] = teachers.filter((teacher) => {
            return teacher.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          });
          setFilteredSearch(tempSearchResult);
        } else {
          setFilteredSearch(teachers);
        }

        if (activeTeacherFound) {
          setActiveTeacher(activeTeacherFound);
        }
      } catch (error) {}
    };

    fetchData();
  }, [createTeacherModalOpen, infoModalOpen, editMode]);

  useEffect(() => {
    if (teacherList) {
      let tempSearchResult: TeacherDto[] = teacherList.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSearch(tempSearchResult);
    }
  }, [searchQuery]);

  const openInfoModal = useCallback(
    (teacher: TeacherDto) => {
      setActiveTeacher(teacher);
      setInfoModalOpen(true);
    },
    [setActiveTeacher, setInfoModalOpen]
  );

  const closeTeacherCreationModal = (toastInfo: {
    isToastOpen: boolean;
    toastMsg: string;
    color: string;
  }) => {
    setCreateTeacherModalOpen(false);
    setToastInfo(toastInfo);
  };

  const confirmEdit = async () => {
    let response = await teacherApi.teacherControllerFindOne(
      (activeTeacher as any)._id
    );
    let newActiveTeacher = response.data;

    //TODO buraya id verilecek en kötü
    setActiveTeacher(newActiveTeacher);
    setEditMode(false);
  };

  const deleteTeacher = async (id: string) => {
    await teacherApi.teacherControllerRemove(id);
    // Refresh lazım olabilir.
  };

  return (
    <>
      <IonContent forceOverscroll={false}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Öğretmen Sayfası</IonTitle>
          </IonToolbar>
          <IonGrid className="ays-no-p">
            <IonRow className="center-search">
              <IonCol>
                <IonSearchbar
                  className="class-page-searchbar"
                  placeholder="Öğretmen Ara"
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
                  onIonClear={() => setFilteredSearch(teacherList)}
                ></IonSearchbar>
              </IonCol>
              <IonButton
                fill="clear"
                size="small"
                onClick={() => setCreateTeacherModalOpen(true)}
              >
                <IonIcon slot="start" icon={add} />
              </IonButton>
            </IonRow>
          </IonGrid>
        </IonHeader>
        {filteredSearch.map((teacher, index) => (
          <TeacherListItem
            key={index}
            teacher={teacher}
            itemClicked={() => openInfoModal(teacher)}
          />
        ))}
      </IonContent>
      <AddTeacherModal
        isModalOpen={createTeacherModalOpen}
        closeModal={closeTeacherCreationModal}
      />
      <TeacherInfo
        confirmEdit={confirmEdit}
        isModalOpen={infoModalOpen}
        setToastInfo={setToastInfo}
        closeModal={() => setInfoModalOpen(false)}
        teacher={activeTeacher}
        isEditMode={editMode}
        setEditMode={setEditMode}
        classList={classList as ClassDto[]}
        deleteTeacher={deleteTeacher}
      />
      <IonToast
        isOpen={toastInfo.isToastOpen}
        message={toastInfo.toastMsg}
        color={toastInfo.color}
        onDidDismiss={() => setToastInfo(initToastInfo)}
        duration={1600}
      ></IonToast>
    </>
  );
}

export default TeacherPage;
