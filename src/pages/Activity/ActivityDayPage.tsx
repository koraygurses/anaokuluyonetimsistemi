import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonHeader,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonContent,
  RefresherEventDetail,
  IonicSlides,
} from "@ionic/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { add } from "ionicons/icons";
import ActivityCreationModal from "../../components/ActivityComponents/ActivityCreationModal";
import { ActivityApi } from "../../../api/api";
import {
  ActivityDto,
  ActivityDtoTypeEnum,
  ClassDto,
  StudentDto,
  UpdateActivityDto,
} from "../../../api/models";
import { RoleEnum } from "../../utils/enum/RoleEnum";
import { useAppSelector } from "../../reducers/hooks";
import { IUser } from "../../reducers/userReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faUsers, faUtensils } from "@fortawesome/free-solid-svg-icons";
import ActivityUpdateModal from "../../components/ActivityComponents/ActivityUpdateModal";
import ActivityRecordsModal from "../../components/ActivityComponents/ActivityRecordsModal";
import { Manipulation } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "swiper/css/effect-fade";
import "@ionic/react/css/ionic-swiper.css";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import ActivityListView from "./ActivityListView";
import { removeHourSection } from "../../utils/AysUtils";
import ActivityPageHeader from "../../components/Header/ActivityPageHeader";
import ActivityRecordUpdateModal from "../../components/ActivityComponents/ActivityRecordUpdateModal";

interface ActivityDayPageProps {
  date: Date;
  activeClass: ClassDto | undefined;
  setActiveClass: (clazz: ClassDto) => void;
  classList: ClassDto[];
  activeStudent: StudentDto | undefined;
  setActiveStudent: (student: StudentDto) => void;
  studentList: StudentDto[];
  dateChanged: (date: Date) => void;
  handleActivityAddition: (activityList: ActivityDto[]) => void;
  handleActivityUpdate: (activity: UpdateActivityDto) => void;
  handleActivityDeletion: (deletedActivityId: string) => void;
}

const api = new ActivityApi({
  basePath: AYS_BASEPATH,
});

function ActivityDayPage({
  date,
  activeClass,
  setActiveClass,
  classList,
  activeStudent,
  setActiveStudent,
  studentList,
  dateChanged,
  handleActivityAddition,
  handleActivityDeletion,
  handleActivityUpdate,
}: ActivityDayPageProps) {
  const tempUser = localStorage.getItem("user");
  const userStorage = tempUser
    ? (JSON.parse(tempUser) as IUser)
    : ({} as IUser);
  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  interface IActivityContainer {
    activityList: ActivityDto[];
    date: Date;
  }

  const initCreationModalInfo = {
    isCreateModalOpen: false,
    activityType: {} as ActivityDtoTypeEnum,
  };

  const initActivityContainer = {
    prev: {
      activityList: [] as ActivityDto[],
      date: date,
    } as IActivityContainer,
    current: {
      activityList: [] as ActivityDto[],
      date: date,
    } as IActivityContainer,
    next: {
      activityList: [] as ActivityDto[],
      date: date,
    } as IActivityContainer,
  };

  const [createModalInfo, setCreateModalInfo] = useState(initCreationModalInfo);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState<ActivityDto>(
    {} as ActivityDto
  );
  const [isRecordUpdateModalOpen, setRecordUpdateModalOpen] =
    useState<ActivityDto>({} as ActivityDto);
  const [isRecordsOpen, setRecordsOpen] = useState(false);
  const [activityContainer, setActivityContainer] = useState(
    initActivityContainer
  );
  const [activityTriduumArray, setActivityTriduumArray] = useState(
    [] as IActivityContainer[]
  );

  //swiper garipliği yüzünden bu var
  const [lastSwiperIndex, setLastSwiperIndex] = useState(0);

  const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    if (activeClass) {
      setTriduumActivitySchedule((activeClass as any)._id, date);
    } else {
      if (activeStudent) {
        setTriduumActivitySchedule((activeStudent.classid as any)._id, date);
      }
    }
  }, [activeClass, activeStudent]);

  const setTriduumActivitySchedule = async (classid: string, date: Date) => {
    let prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);

    let nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const triduumActivitySet = await api.activityControllerGetTriduumSchedule(
      date.toLocaleDateString("tr"),
      classid
    );

    const prevActivityList: ActivityDto[] = triduumActivitySet.data.filter(
      (activity: ActivityDto) =>
        activity.date === prevDate.toLocaleDateString("tr")
    );
    const activityList: ActivityDto[] = triduumActivitySet.data.filter(
      (activity: ActivityDto) => activity.date === date.toLocaleDateString("tr")
    );
    const nextActivityList: ActivityDto[] = triduumActivitySet.data.filter(
      (activity: ActivityDto) =>
        activity.date === nextDate.toLocaleDateString("tr")
    );

    const newActivityContainer = {
      prev: { activityList: prevActivityList, date: prevDate },
      current: { activityList: activityList, date: date },
      next: { activityList: nextActivityList, date: nextDate },
    };

    setActivityTriduumArray(
      getTriduumArray(
        newActivityContainer,
        swiperRef.current ? swiperRef.current.swiper.realIndex : 0
      )
    );
    setActivityContainer(newActivityContainer);
  };

  const refreshActivityPage = async (
    createdActivityList?: ActivityDto[],
    updatedActivity?: UpdateActivityDto,
    deletedActivityId?: string
  ) => {
    let classId = activeClass
      ? (activeClass as any)._id
      : ((activeStudent as StudentDto).classid as any)._id;
    await setTriduumActivitySchedule(classId, date);
    setUpdateModalOpen({} as ActivityDto);
    setRecordUpdateModalOpen({} as ActivityDto);
    setCreateModalInfo({
      isCreateModalOpen: false,
      activityType: {} as ActivityDtoTypeEnum,
    });

    if (createdActivityList && createdActivityList.length > 0) {
      handleActivityAddition(createdActivityList);
    }

    if (updatedActivity) {
      handleActivityUpdate(updatedActivity);
    }

    if (deletedActivityId) {
      handleActivityDeletion(deletedActivityId);
    }
  };

  const closeCreationModal = () => {
    setCreateModalInfo({
      isCreateModalOpen: false,
      activityType: {} as ActivityDtoTypeEnum,
    });
  };

  function refreshPage(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      refreshActivityPage();
      event.detail.complete();
    }, 1200);
  }

  const onDateChange = async (newDate: Date) => {
    newDate = removeHourSection(newDate);
    dateChanged(newDate);
    if (activeClass) {
      await setTriduumActivitySchedule((activeClass as any)._id, newDate);
    } else if (activeStudent) {
      await setTriduumActivitySchedule(
        (activeStudent.classid as any)._id,
        newDate
      );
    }
  };

  const changeDateBySwipe = async (swiper: SwiperType) => {
    if (lastSwiperIndex !== swiper.realIndex) {
      await shiftTriduum(swiper.swipeDirection, swiper.realIndex);
      setLastSwiperIndex(swiper.realIndex);
    }
  };

  const getTriduumArray = (activityContainer: any, swiperIndex: number) => {
    let newArr: any[] = [
      activityContainer.current,
      activityContainer.next,
      activityContainer.prev,
    ];

    let shiftBy = swiperIndex % newArr.length;

    return [
      ...newArr.slice(newArr.length - shiftBy),
      ...newArr.slice(0, newArr.length - shiftBy),
    ];
  };

  const shiftTriduum = async (
    direction: "prev" | "next",
    swiperIndex: number
  ) => {
    let classId = activeClass
      ? (activeClass as any)._id
      : ((activeStudent as StudentDto).classid as any)._id;

    if (direction === "prev") {
      const newPrevDate = new Date(activityContainer.prev.date);
      newPrevDate.setDate(newPrevDate.getDate() - 1);
      const prevActivity = (
        await api.activityControllerGetDailySchedule(
          newPrevDate.toLocaleDateString("tr"),
          classId
        )
      ).data;

      const newActivityContainer = {
        prev: { activityList: prevActivity, date: newPrevDate },
        current: activityContainer.prev,
        next: activityContainer.current,
      };

      setActivityContainer(newActivityContainer);
      setActivityTriduumArray(
        getTriduumArray(newActivityContainer, swiperIndex)
      );
      dateChanged(newActivityContainer.current.date);
    } else if (direction === "next") {
      const newNextDate = new Date(activityContainer.next.date);
      newNextDate.setDate(newNextDate.getDate() + 1);
      const nextActivity = (
        await api.activityControllerGetDailySchedule(
          newNextDate.toLocaleDateString("tr"),
          classId
        )
      ).data;
      const newActivityContainer = {
        prev: activityContainer.current,
        current: activityContainer.next,
        next: { activityList: nextActivity, date: newNextDate },
      };

      setActivityContainer(newActivityContainer);
      setActivityTriduumArray(
        getTriduumArray(newActivityContainer, swiperIndex)
      );
      dateChanged(newActivityContainer.current.date);
    }
  };

  const getActivityComp = (activityList: ActivityDto[]) => {
    return (
      <ActivityListView
        activityList={activityList}
        studentsOfParent={studentList}
        refreshPage={refreshPage}
        setRecordsOpen={setRecordsOpen}
        setRecordUpdateModalOpen={setRecordUpdateModalOpen}
        setUpdateModalOpen={setUpdateModalOpen}
      />
    );
  };

  return (
    <IonContent
      id="activity-menu-content"
      className="ays-bg-light-tint"
      scrollY={false}
      fullscreen={true}
      forceOverscroll={true}
    >
      <IonHeader translucent={true}>
        <IonToolbar>
          <ActivityPageHeader
            activityDate={activityContainer.current.date}
            onDateChange={onDateChange}
          />
        </IonToolbar>
        {RoleEnum.parent !== user.roles[0] ? (
          <IonItem color={`light`} lines="none">
            <IonSelect
              className="ays-bold"
              cancelText="İptal"
              okText="Tamam"
              label="Sınıf"
              labelPlacement="start"
              value={activeClass}
              onIonChange={(e) => setActiveClass(e.detail.value)}
            >
              {classList.map((clazz) => (
                <IonSelectOption key={(clazz as any)._id} value={clazz}>
                  {clazz.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        ) : (
          <IonItem lines="none">
            <IonSelect
              className="ays-bold"
              cancelText="İptal"
              okText="Tamam"
              label="Öğrenci"
              labelPlacement="start"
              value={activeStudent}
              onIonChange={(e) => setActiveStudent(e.detail.value)}
            >
              {studentList.map((student) => (
                <IonSelectOption key={(student as any)._id} value={student}>
                  {student.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        )}
      </IonHeader>
      {activityTriduumArray.length > 0 && (
        <Swiper
          ref={swiperRef}
          modules={[Manipulation, IonicSlides]}
          slidesPerView={1}
          slidesPerGroup={1}
          loop
          onSlideChangeTransitionStart={(event) => changeDateBySwipe(event)}
          style={{ width: "100%", height: "100%" }}
        >
          <SwiperSlide style={{ width: "100%" }}>
            {getActivityComp(activityTriduumArray[0].activityList)}
          </SwiperSlide>
          <SwiperSlide style={{ width: "100%" }}>
            {getActivityComp(activityTriduumArray[1].activityList)}
          </SwiperSlide>
          <SwiperSlide style={{ width: "100%" }}>
            {getActivityComp(activityTriduumArray[2].activityList)}
          </SwiperSlide>
        </Swiper>
      )}

      {activeClass && (
        <>
          {user.roles[0] !== RoleEnum.parent && (
            <ActivityRecordsModal
              className={(activeClass as any).name}
              activityList={activityContainer.current.activityList}
              isModalOpen={isRecordsOpen}
              closeModal={() => setRecordsOpen(false)}
            />
          )}
          <ActivityCreationModal
            modalInfo={createModalInfo}
            closeModal={closeCreationModal}
            date={date}
            refreshActivityPage={refreshActivityPage}
            activeClass={activeClass}
            classList={classList}
          />
        </>
      )}

      {isUpdateModalOpen.classId && (
        <ActivityUpdateModal
          isUpdateModalOpen={isUpdateModalOpen}
          setUpdateModalOpen={setUpdateModalOpen}
          refreshActivityPage={refreshActivityPage}
        />
      )}

      {isRecordUpdateModalOpen.classId && (
        <ActivityRecordUpdateModal
          isRecordUpdateModalOpen={isRecordUpdateModalOpen}
          setRecordUpdateModalOpen={setRecordUpdateModalOpen}
          refreshActivityPage={refreshActivityPage}
        />
      )}

      {(RoleEnum.instructor === user.roles[0] ||
        RoleEnum.admin === user.roles[0]) && (
          <IonFab
            className=" mb-md-0"
            slot="fixed"
            vertical="bottom"
            horizontal="end"
            color="danger"
          >
            <IonFabButton className="mb-5 mb-md-0">
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
            <IonFabList className="pb-5 pb-md-0" side="top">
              <IonFabButton
                onClick={() => {
                  setCreateModalInfo({
                    isCreateModalOpen: true,
                    activityType: ActivityDtoTypeEnum.Default,
                  });
                }}
                data-value="Etkinlik"
              >
                <FontAwesomeIcon icon={faSun} />
              </IonFabButton>
              <IonFabButton
                onClick={() => {
                  setCreateModalInfo({
                    isCreateModalOpen: true,
                    activityType: ActivityDtoTypeEnum.Meal,
                  });
                }}
                data-value="Yemek"
              >
                <FontAwesomeIcon icon={faUtensils} />
              </IonFabButton>
              <IonFabButton
                onClick={() => {
                  setCreateModalInfo({
                    isCreateModalOpen: true,
                    activityType: ActivityDtoTypeEnum.Attendance,
                  });
                }}
                data-value="Yoklama"
              >
                <FontAwesomeIcon icon={faUsers} />
              </IonFabButton>
            </IonFabList>
          </IonFab>
        )}
    </IonContent>
  );
}

export default ActivityDayPage;
