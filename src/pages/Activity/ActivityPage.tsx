import ActivityDayPage from "./ActivityDayPage";
import { useEffect, useRef, useState } from "react";
import { ActivityDto, ClassDto, StudentDto, UpdateActivityDto } from "../../../api/models";
import { ActivityApi, ClassApi, StudentApi, TeacherApi } from "../../../api/api";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import { Event } from "react-big-calendar";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { IUser } from "../../reducers/userReducer";
import { RoleEnum } from "../../utils/enum/RoleEnum";
import { AxiosResponse } from "axios";
import { ActivityPageView } from "../../utils/AysUtils";
import ActivityMenu from "./ActivityMenu";
import ActivityCalendarView from "./ActivityCalendarView";
import { setActivityPageView } from "../../reducers/activityViewReducer";

function ActivityPage() {

    const tempUser = localStorage.getItem("user");
    const userStorage = tempUser
        ? (JSON.parse(tempUser) as IUser)
        : ({} as IUser);
    const user: IUser = useAppSelector((state) =>
        state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
    );

    const view = useAppSelector((state) => state.rootReducer.activityPageView.value);

    const dispatch = useAppDispatch();

    const activityApi = new ActivityApi({
        basePath: AYS_BASEPATH,
    });
    const studentApi = new StudentApi({
        basePath: AYS_BASEPATH,
    });
    const teacherApi = new TeacherApi({
        basePath: AYS_BASEPATH,
    });
    const classApi = new ClassApi({
        basePath: AYS_BASEPATH,
    });

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [activeClass, setActiveClass] = useState<ClassDto>();
    const [activeStudent, setActiveStudent] = useState<StudentDto>();
    const [eventList, setEventList] = useState<Event[]>([] as Event[]);
    const [classList, setClassList] = useState<ClassDto[]>([] as ClassDto[]);
    const [studentList, setStudentList] = useState<StudentDto[]>([] as StudentDto[]);

    const menuRef = useRef<HTMLIonMenuElement>(null);

    useEffect(() => {
        //Başlangıç için aktivite listesi çağırma
        try {
            const initActivities = async () => {
                switch (user.roles[0]) {
                    case RoleEnum.parent:
                        const parentid = user.id;
                        const parentResponse = await studentApi.studentControllerGetStudentByParentID(parentid);

                        const studentList = (parentResponse as AxiosResponse).data;

                        //TODO Öğrenci olmadığı durumda ekran çıkarmak lazım
                        if (studentList && studentList.length > 0) {
                            if (activeStudent) {
                                setActiveStudent(activeStudent)
                            } else {
                                setActiveStudent(studentList[0]);
                            }
                        }

                        setStudentList(studentList);
                        break;
                    case RoleEnum.instructor:
                        const teacher = (await teacherApi.teacherControllerFindOneByGSM(user.gsm)).data;
                        const classResponse = await classApi.classControllerGetClassesByTeacherID((teacher as any)._id);

                        const teacherClassList = classResponse.data;

                        if (teacherClassList && teacherClassList.length > 0) {
                            if (activeClass) {
                                setActiveClass(activeClass);
                            } else {
                                setActiveClass(teacherClassList[0]);
                            }
                        }

                        setClassList(teacherClassList);
                        break;
                    case RoleEnum.admin:
                        const classList = await classApi.classControllerFindAll();

                        if (classList.data && classList.data.length > 0) {
                            if (activeClass) {
                                setActiveClass(activeClass);
                            } else {
                                setActiveClass(classList.data[0]);
                            }
                        }

                        setClassList(classList.data);
                        break;
                }
            };

            initActivities();
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        //aylık ve haftalık gösterim için
        const allActivities = async () => {

            let classId = "";

            if (activeClass) {
                classId = (activeClass as any)._id;
            }

            if (activeStudent) {
                classId = (activeStudent.classid as any)._id;
            }

            if (classId) {

                const response = await activityApi.activityControllerGetAllSchedule(
                    classId
                );

                const allActivities = response.data;

                let eventList: Event[] = [];

                allActivities.forEach((activity) => {

                    let newEvent = convertActivityToCalendarEvent(activity);

                    if (newEvent) {
                        eventList.push(newEvent);
                    }
                });

                setEventList(eventList);
            }
        };

        allActivities();
    }, [activeClass, activeStudent]);

    useEffect(() => {

        if (view !== ActivityPageView.day) {
            dispatch(setActivityPageView(ActivityPageView.day));
        }
    }, [currentDate, dispatch]);

    const convertActivityToCalendarEvent = (activity: ActivityDto | UpdateActivityDto): Event | undefined => {

        if (activity.date && activity.start && activity.end) {

            const [day, month, year] = activity.date.split(".").map(Number);

            const startDate = new Date(year, month - 1, day);
            const activityStartDate = new Date(activity.start);
            startDate.setHours(activityStartDate.getUTCHours());
            startDate.setMinutes(activityStartDate.getUTCMinutes());

            const endDate = new Date(year, month - 1, day);
            const activityEndDate = new Date(activity.end);
            endDate.setHours(activityEndDate.getUTCHours());
            endDate.setMinutes(activityEndDate.getUTCMinutes());

            const resource = {
                id: (activity as any)._id,
                desc: activity.description,
            };

            let event: Event = {
                title: activity.name,
                start: startDate,
                end: endDate,
                resource: resource,
            };

            return event;
        }

        return undefined;
    };

    const changeView = (view: ActivityPageView) => {
        dispatch(setActivityPageView(view))
        if (menuRef.current) {
            menuRef.current.close();
        }
    }

    const daySelected = (date: Date) => {

        setCurrentDate(date);
    }

    const handleActivityAddition = (activityList: ActivityDto[]) => {
        const tempEventList = [...eventList];
        activityList.forEach((activity) => {
            let newEvent = convertActivityToCalendarEvent(activity)
            if (activity.classId === (activeClass as any)._id) {
                if (newEvent) {
                    tempEventList.push(newEvent);
                }
            }
        });
        setEventList(tempEventList);
    }

    const handleActivityUpdate = (updatedActivity: UpdateActivityDto) => {
        const tempEventList = [...eventList];
        let newEvent = convertActivityToCalendarEvent(updatedActivity)
        if (newEvent) {
            const index = tempEventList.findIndex((event) => event.resource.id === updatedActivity.id);
            tempEventList[index] = newEvent;
        }
        setEventList(tempEventList);
    }

    const handleActivityDeletion = (deletedActivityId: string) => {
        const tempEventList = [...eventList];
        if (deletedActivityId) {
            const index = tempEventList.findIndex((event) => event.resource.id === deletedActivityId);
            tempEventList.splice(index, 1);
        }
        setEventList(tempEventList);
    }

    const getActivityView = () => {
        if (ActivityPageView.day === view) {
            return (
                <ActivityDayPage
                    date={currentDate}
                    dateChanged={setCurrentDate}
                    activeClass={activeClass}
                    classList={classList}
                    activeStudent={activeStudent}
                    setActiveClass={setActiveClass}
                    setActiveStudent={setActiveStudent}
                    studentList={studentList}
                    handleActivityAddition={handleActivityAddition}
                    handleActivityUpdate={handleActivityUpdate}
                    handleActivityDeletion={handleActivityDeletion}
                />
            )
        } else {
            return (
                <ActivityCalendarView
                    menuRef={menuRef}
                    classList={classList}
                    eventList={eventList}
                    onDateSelect={daySelected}
                    view={view === ActivityPageView.week ? 'week' : 'month'}
                    selectedDate={currentDate}
                    activeClass={activeClass}
                    activeStudent={activeStudent}
                    studentList={studentList}
                    setActiveClass={setActiveClass}
                    setActiveStudent={setActiveStudent}
                />
            )
        }
    }

    return (
        <>
            <ActivityMenu activeView={view} toggleView={changeView} menuRef={menuRef} />
            {getActivityView()}
        </>
    )
}

export default ActivityPage;